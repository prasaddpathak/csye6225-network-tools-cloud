/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing
    Purpose:    Provide services for account related API
*/

import Document from './../models/document.js'
import {isUserAuthorized, uploadNewFiles, deleteS3File} from "./utils.js";
import {genSalt, hash} from "bcrypt";

export const create = async (request, response) => {
    const user = await isUserAuthorized(request)
    user.password = undefined
    const userId = user.id
    const userS3Folder = userId + '/'


    if (request.files == null || request.files.length === 0   ) {
        throw "No files Uploaded"
    }
    console.log(`Total Files Present : ${request.files.length}`)


    // Check if the file already exists for the user
    const checkIfDocAlreadyExists = await Promise.all(
        request.files.map( (file) => {
            // console.log(file.originalname)
            console.log(`Checking if ${file.originalname} is already present for ${userId}: `)
            return  Document.findOne({
                where: {
                    user_id : userId,
                    name : file.originalname
                }
            })
        }))
    const checkBoolean = checkIfDocAlreadyExists.map((doc) => doc !== null)
    if (checkBoolean.includes(true)) {
        throw "Upload file(s) already exists"
    }

    // Upload files to s3
    const uploadResults = await uploadNewFiles(request, userId)
    if (uploadResults === 0) {
        throw "Upload unsuccessful"
    }

    // Insert entries in the Document table for the uploaded files
    const documentsUploaded = uploadResults.map((res) => {
        return {
            user_id : userId,
            name : res.Key.split('/')[1],
            s3_bucket_path : res.Location,
            etag : res.ETag.replaceAll("\"","")
        }
    })
    const dbDocumentsInsert = await Promise.all(
        documentsUploaded.map((doc) => Document.create(doc))
    )

    return dbDocumentsInsert
}

export const getAll = async  (request) => {
    const user = await isUserAuthorized(request)

    const getDocumentsResult = await Document.findAll({
        where : {
            user_id: user.id
        }
    })

    return getDocumentsResult
}

export const getSingleDocument = async (request) => {
    const user = await isUserAuthorized(request, "document")
    const doc_id = request.params.id

    const getDocumentsResult = await Document.findOne({
        where : {
            user_id: user.id,
            doc_id : doc_id
        }
    })

    if (getDocumentsResult == null ) {
        throw "Document with mentioned ID does not exist for this user"
    }
    return getDocumentsResult
}

export const deleteSingleDocument = async (request) => {

    const user = await isUserAuthorized(request, "document")

    const doc_id = request.params.id

    const getDocumentsResult = await Document.findOne({
        where : {
            user_id: user.id,
            doc_id : doc_id
        }
    })

    if (getDocumentsResult == null ) {
        throw "File not found"
    }

    const fileKey = user.id + '/'+ getDocumentsResult.name
    console.log(fileKey)
    const deleteResponse = await deleteS3File(fileKey)

    if (deleteResponse) {
        const documentDeleteResult = await Document.destroy({
            where : {
                user_id: user.id,
                doc_id : doc_id
            }
        })
        console.log(`Record Deleted`)
        console.log(documentDeleteResult)
    }

    return
}