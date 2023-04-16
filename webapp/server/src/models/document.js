/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing
    Purpose:    Provide schema for document related records
*/

import { DataTypes } from 'sequelize'
import {sequelize} from "../services/utils.js"
import {hash, genSalt} from  "bcrypt"

const Document = sequelize.define('documents', {
        // Model attributes are defined here
        doc_id : {
            type : DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            readOnly: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            readOnly: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            readOnly: true,
            allowNull: false,
        },
        s3_bucket_path : {
            type: DataTypes.STRING,
            readOnly: true,
            allowNull: false,
        },
        etag : {
            type: DataTypes.STRING,
            readOnly: true,
            allowNull: false,
        }},
    {
        createdAt: 'date_created'
    }
);

try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await Document.sync({ alter: true })
    console.log("Documents model was synchronized successfully.");
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default Document;