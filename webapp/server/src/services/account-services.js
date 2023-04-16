/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing 
    Purpose:    Provide services for account related API 
*/

import Account from './../models/account.js'
import {
    deleteDynamoEntry,
    getDynamoEntry,
    isUserAuthorized,
    triggerAccountVerificationFlow
} from "./utils.js";
import {genSalt, hash} from "bcrypt";

export const create = async (newAccount) => {
    console.log(Date().toString() + ' :: Filtering payload')
    try {
        const acc = {
            first_name : newAccount.first_name,
            last_name : newAccount.last_name,
            username : newAccount.username,
            password : newAccount.password
        }
        const account =  await Account.create(acc);
        await triggerAccountVerificationFlow(account)
        return account
    } catch (e) {
        return e
    }
}

export const get = async  (request) => {
    return await isUserAuthorized(request)
}

export const update = async (request) => {
    const user = await isUserAuthorized(request)

    // Check if input payload contains any other fields than the editable fields
    const updatedAcc = request.body
    for(let key in updatedAcc) {
        if (key != 'first_name' && key != 'last_name' && key != 'password' ) {
            throw "Invalid input fields"
        }
    }
    if (updatedAcc.password != null) {
        const salt = await genSalt()
        console.log(Date().toString() + ' :: Hashing password before update')
        const hashedPassword = await hash(updatedAcc.password, salt)
        updatedAcc.password = hashedPassword
    }
    await Account.update(updatedAcc, {
        where: {
            id : user.id
        }
    })
}

export const verifyEmail = async (request) => {

    const username = request.query.username
    const token = request.query.token

    const dynamoItems = await getDynamoEntry(username,token)

    console.log(dynamoItems)
    if (dynamoItems.Item == undefined) {
        throw "Token not found"
    }

    const dynamoEmail = dynamoItems.Item.userid.S
    console.log(dynamoEmail)

    if (dynamoEmail != username) throw "Email not verified"

    const updateAcc = {
        isVerified : true
    }

    await Account.update(updateAcc, {
        where: {
            username : username
        }
    })

    await deleteDynamoEntry(username, token)


}