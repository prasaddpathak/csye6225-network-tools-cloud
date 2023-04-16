/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing 
    Purpose:    Provide controls for account related routes 
*/

import * as accountService from '../services/account-services.js';
import {handleErrorResponse, logger} from "../services/utils.js";
import lynx from 'lynx'

let metrics = new lynx('localhost', 8125);

// Creating a new user
export const post = async(request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received POST: /v1/account')
        logger.info("Received POST: /v1/account")
        metrics.increment('post.accounts.create');
        const payload = request.body
        const acc = await accountService.create(payload)
        acc.password = undefined
        response.status(201).send(acc)
        console.log(Date().toString() + ' :: Returned 201 :: Account Created :: ' + acc.id)
    } catch (error) {
        response.sendStatus(400)
        console.log(Date().toString() + ' :: Returned 400 :: ' + error)
    }
}

// Retrieving user information
export const get = async(request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received GET: /v1/account/:id')
        logger.info("Received GET: /v1/account/:id")
        metrics.increment('get.accounts.details');
        const acc = await accountService.get(request);
        acc.password = undefined
        response.status(200).send(acc)
        console.log(Date().toString() + ' :: Returned 200 :: Account Fetched :: ' + acc.id)
    } catch (error) {
        handleErrorResponse(error,response)
    }
}

// Updating user information
export const update = async(request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received PUT: /v1/account/:id')
        logger.info("Received PUT: /v1/account/:id")
        metrics.increment('put.accounts.update');
        if (JSON.stringify(request.body) === '{}') {
            handleErrorResponse("Invalid input fields", response)
            return
        }
        await accountService.update(request);
        response.sendStatus(204)
        console.log(Date().toString() + ' :: Returned 204 :: No Content')

    } catch (error) {
        handleErrorResponse(error,response)
    }
}

export const verify =  async (request, response) => {
    try {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received GET: /v1/verifyUserEmail')
        logger.info("Received GET: /v1/verifyUserEmail")
        metrics.increment('put.accounts.verify');
        await accountService.verifyEmail(request)
        response.sendStatus(200)
        console.log(Date().toString() + ' :: Returned 204 :: No Content')
    } catch (error) {
        handleErrorResponse(error,response)
    }
}