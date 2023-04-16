import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'
import Account from "../models/account.js";
import * as auth from "basic-auth";
import {compare} from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import  AWS from 'aws-sdk'; // Version 2
import winston from 'winston'
import appRootPath from "app-root-path";
dotenv.config()

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER_ID, process.env.USER_PASS, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
});

console.log(appRootPath + '/src/logs/combined.log')

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: appRootPath + '/logs/combined.log' }),
    ],
})

export const isUserAuthorized = async (request, type) => {

    // Details received via Basic Auth
    if (request.headers.authorization == null || !request.headers.authorization.includes('Basic')) {
        throw "Provide Basic Auth Credentials"
    }
    const acc = await auth.parse( request.headers.authorization)
    const reqUsername = acc.name
    const reqPass = acc.pass

    // Data fetched from database
    const dbAcc = await Account.findOne({
        where: {
            username : reqUsername
        }
    })
    if (dbAcc === null) {
        throw "Username does not exist" // Should return 401
    }

    // Verify credentials
    const reqId = request.params.id
    const compareResult = await  compare(reqPass,dbAcc.password)
    if (dbAcc.username === reqUsername &&  compareResult ) {
        if (reqId == null || type == "document") return dbAcc
        // Verify if request is made for the correct ID
        if (dbAcc.id == reqId) {
            if (dbAcc.isVerified == true) {
                return dbAcc
            } else {
                throw "Email not verified"
            }
        }
        else throw "ID and username do not match" // Should return 403
    } else {
        throw "Provided Credentials do not match" // Should return 401
    }

}

export const handleErrorResponse = (error, response) => {
    let errorCode = 400
    if (error == "ID and username do not match" || error == "Provide Basic Auth Credentials" || error == "Document with mentioned ID does not exist for this user" ) {
        errorCode = 403
        response.sendStatus(errorCode)
    }
    else if (error == "Provided Credentials do not match" || error == "Username does not exist" || error == "Email not verified") {
        errorCode = 401
        response.sendStatus(errorCode)
    }
    else if (error == "Invalid input fields") {
        errorCode = 400
        response.sendStatus(errorCode)
    }
    else if (error == "File not found" || error=="Token not found") {
        errorCode = 404
        response.sendStatus(errorCode)
    }
    console.log(Date().toString() + ' :: Returned '+ errorCode +' :: ' + error )
}

export const createNewS3Folder = async (folderName) => {
    if (folderName == null) {
        throw "Folder name cannot be null"
        return
    }
    // console.log(`Creating new folder: ` + folderName)
    AWS.config.region = process.env.S3_BUCKET_REGION;
    const s3Client = new AWS.S3();
    const params = { Bucket: process.env.S3_BUCKET_NAME, Key: folderName+'/', Body:'New Folder Created' };
    s3Client.upload(params);

}

//using multer
export const uploadNewFiles = async (request, userId) => {

    AWS.config.region = process.env.S3_BUCKET_REGION;
    const s3Client = new AWS.S3();

    let newFilesArray = []

    const paramsArr = request.files.map( (file) => {
        return  {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: userId+'/' + file.originalname,
            Body: file.buffer
        }
    })

    let results = await Promise.all(
        paramsArr.map( param => s3Client.upload(param).promise() )
    )

    return results
}

export const deleteS3File = async (key) => {

    AWS.config.region = process.env.S3_BUCKET_REGION;
    const s3Client = new AWS.S3();

    const param = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    }
    console.log(`Deleting Objects`)
    let results = await s3Client.deleteObject(param).promise()
    console.log(results)
    console.log(`Objects Deleted`)
    return true
}

export const  triggerAccountVerificationFlow = async (acc) => {

    AWS.config.region = process.env.S3_BUCKET_REGION;
    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    const randToken = uuidv4()
    const ddbPayload = {
        TableName: 'users',
        Item: {
            'userid': {S: `${acc.username}`},
            'otp': {S: `${randToken}`},
            'expireAt' : {N : `${Math.round(Date.now() / 1000) + 300}`}
        }
    };
    // console.log(ddbPayload)
    const ddbResponse = await ddb.putItem(ddbPayload).promise();
    // console.log(ddbResponse)

    const baseURI = process.env.ENV === "local" ? "localhost:3000" : process.env.ENV === "dev" ? "dev.prasadpathak.me" : "prod.prasadpathak.me"
    const fromEmail = process.env.ENV === "local" ? "dev.prasadpathak.me" : process.env.ENV === "dev" ? "dev.prasadpathak.me" : "prod.prasadpathak.me"
    const snsMsg = {
        toEmail : acc.username,
        baseURI : `${baseURI}/v1/verifyUserEmail?username=${acc.username}&token=${randToken}`,
        fromEmail : `no-reply@${fromEmail}`
    }
    // console.log(snsMsg)
    const snsPayload = {
        Message : JSON.stringify(snsMsg),
        TopicArn: process.env.SNS_TOPIC_ARN
    }
    // console.log(snsPayload)
    const sns = new AWS.SNS({apiVersion: '2010-03-31'})
    const snsResponse = await sns.publish(snsPayload).promise()
    // console.log(snsResponse)
    return (snsResponse)
}

export const getDynamoEntry = async (username, token) => {
    AWS.config.region = process.env.S3_BUCKET_REGION;
    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    // console.log(username)
    const getDynamoItemParams = {
        TableName: 'users',
        Key: {
            "userid" : {"S" : `${username}`},
            "otp" : {"S" : token},
        }
    }
    // console.log(getDynamoItemParams)
    const getDynamoItem = await ddb.getItem(getDynamoItemParams).promise()

    return getDynamoItem
}

export const deleteDynamoEntry = async (username, token) => {
    AWS.config.region = process.env.S3_BUCKET_REGION;
    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    const getDynamoItemParams = {
        TableName: 'users',
        Key: {
            "userid" : {"S" : username},
            "otp" : {"S" : token},
        }
    }
    const getDynamoItem = await ddb.deleteItem(getDynamoItemParams).promise()
}