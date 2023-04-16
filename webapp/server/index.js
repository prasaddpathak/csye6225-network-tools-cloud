/*
    Author:     Prasad Pathak 002925486
    Subject:    CSYE6225 - Network Structures & Cloud Computing 
    Purpose:    Index file for the server
*/

import app from "./src/app.js";
import * as dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Server running at ${port}`)
});
