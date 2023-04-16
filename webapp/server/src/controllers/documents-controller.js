/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing
    Purpose:    Provide controls for document related routes
*/

import * as documentsService from '../services/documents-services.js';
import {handleErrorResponse, logger} from "../services/utils.js";
import lynx from 'lynx'

let metrics = new lynx('localhost', 8125);

// Creating a new document
export const post = async (request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received POST: /v1/documents')
        logger.info("Received POST: /v1/documents")
        metrics.increment('post.documents.create');
        const doc = await documentsService.create(request, response)
        response.status(201).send(doc)
        console.log(Date().toString() + ' :: Returned 201 :: Document Created ')
    } catch (error) {
        response.sendStatus(400)
        console.log(Date().toString() + ' :: Returned 400 :: ' + error)
    }
}

// Retrieving all documents for the user
export const getAll = async(request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received GET: /v1/documents')
        logger.info("Received GET: /v1/documents")
        metrics.increment('get.documents.all');
        const doc = await documentsService.getAll(request);
        response.status(200).send(doc)
        console.log(Date().toString() + ' :: Returned 200 :: Documents Fetched ')
    } catch (error) {
        handleErrorResponse(error,response)
    }
}


// Retrieving a single document
export const getOne = async(request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received GET: /v1/documents/:id')
        logger.info("Received GET: /v1/documents/:id")
        metrics.increment('get.documents.one');
        const doc = await documentsService.getSingleDocument(request);
        response.status(200).send(doc)
        console.log(Date().toString() + ' :: Returned 200 :: Document Fetched ')
    } catch (error) {
        handleErrorResponse(error,response)
    }
}

// Deleting a single document
export const deleteOne = async(request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received DELETE: /v1/documents/:id')
        logger.info("Received DELETE: /v1/documents/:id")
        metrics.increment('delete.documents.one');
        await documentsService.deleteSingleDocument(request);
        response.sendStatus(204)
        console.log(Date().toString() + ' :: Returned 204 :: No Content')

    } catch (error) {
        handleErrorResponse(error,response)
    }
}