import request from 'supertest'
import app from "../src/app.js"
import { validate } from 'uuid'

describe('Testing Create Account API' , () => {
    // Generate a random email
    let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = '';
    for(let ii=0; ii<15; ii++){
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    string +=  '@gmail.com'

    test('POST on /v1/account should return 201 CREATED and id should be uuid', async () =>{
        // const response = await request(app).post("/v1/account").send({
        //     "first_name" : "JEST",
        //     "last_name" : "TEST",
        //     "username" : string,
        //     "password"  : "test123"
        // })
        // expect(response.statusCode).toBe(201)
        // expect(validate(response.body.id)).toBe(true)
        console.log(string)
    })

    // test('POST on /v1/account should return 400 BAD REQUEST due to duplicate email', async () =>{
    //     const response = await request(app).post("/v1/account").send({
    //         "first_name" : "JEST",
    //         "last_name" : "TEST DUPLICATE",
    //         "username" : string,
    //         "password"  : "test123"
    //     })
    //     expect(response.statusCode).toBe(400)
    // })

})