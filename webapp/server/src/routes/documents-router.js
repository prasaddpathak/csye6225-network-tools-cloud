/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing
    Purpose:    Provide route for document related API
*/

import express from "express";
import * as documentsController from '../controllers/documents-controller.js';
import multer from 'multer';


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router();

//Create and fetch data for document
router.route('/documents')
    .get(documentsController.getAll)
    // .post(documentsController.post)

// router.post('/documents', upload.array('files'), documentsController.post)
router.post('/documents', upload.any(), documentsController.post)

// Get and delete document data, search by id
router.route('/documents/:id')
    .get(documentsController.getOne)
    .delete(documentsController.deleteOne)

export default router;