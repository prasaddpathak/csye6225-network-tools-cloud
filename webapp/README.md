# CSYE6225 Network Structures & Cloud Computing 
This repository contains web server for csye6225 assignment submissions
## Pre-requisites
- Git 2.x or higher
- NPM 8.x or higher
- NodeJs 16.x or higher
## Installation instructions 
- Clone the organization repo using: `git clone git@github.com:Prasad-Pathak-002925486/webapp.git`
- Change to server directory: `cd server`
- Install NodeJs dependencies: `npm i`
- Create a .env file and add the following variables `PORT`,`MYSQL_HOST`, `USER_ID`, `USER_PASS`
- Start the server: `npm start`

## API Information
Application contains the following endpoints
1. `GET /healthz` - To check the health of the webapp
2. `POST /v1/account` - To create a new account
3. `GET /v1/account/:id` - To receive account information
4. `PUT /v1/account/:id` - To update account information

## Packer Information 
Creates an AWS AMI with the following features:
1. Webapp artifacts
2. Dependencies required for the webapp
3. Database configurations required for the webapp
4. Environment variables required for the webapp
5. Systemd configuration required for the webapp
.
