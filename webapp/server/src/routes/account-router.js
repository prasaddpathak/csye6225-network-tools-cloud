/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing 
    Purpose:    Provide route for account related API 
*/

import express from "express";
import * as accountController from '../controllers/account-controller.js';


const router = express.Router();

//Create and fetch data for account
router.route('/account')
    .post(accountController.post)

//Update,fetch and delete data, search by id
router.route('/account/:id')
    .get(accountController.get)
    .put(accountController.update)

router.route('/verifyUserEmail')
    .get(accountController.verify)
export default router;