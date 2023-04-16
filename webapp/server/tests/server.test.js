import request from 'supertest'
import app from "../src/app.js";


describe('Testing health API' , () => {

    test('GET on / should return 200 OK', async () =>{
        const response = await request(app).get("/")
        expect(response.statusCode).toBe(200)
    })

})
