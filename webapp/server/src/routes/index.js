/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing 
    Purpose:    Index file for routes 
*/

import account_router from './account-router.js';
import documents_router from './documents-router.js'
import lynx from 'lynx'
import {logger} from "../services/utils.js";

let metrics = new lynx('localhost', 8125);

export default (app) => {
    app.use('/v1/', account_router);
    app.use('/v1/', documents_router);

    app.get('/', function (request, response) {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received GET: /')
        logger.info("Received GET: /")
        metrics.increment('get.root');
        response.sendStatus(200)
        console.log(Date().toString() + ' :: Returned 200')
    })
    
    app.get('/health', function (request, response) {
        console.log('------------------------------------')
        console.log(Date().toString() + ' :: Received GET: /healthz')
        logger.info("Received GET: /healthz")
        metrics.increment('get.healthz');
        response.sendStatus(200)
        console.log(Date().toString() + ' :: Returned 200')
    })
}

