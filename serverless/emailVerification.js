var aws = require("aws-sdk");
exports.handler = async (event) => {
    var ses = new aws.SES({ region: "us-east-1" });
    const eventMsg  = event.Records[0].Sns.Message
    const parsedInput = JSON.parse(eventMsg)
    const toEmail  = parsedInput.toEmail
    const baseURI  = "https://" + parsedInput.baseURI
    const fromEmail  = parsedInput.fromEmail
    console.log(toEmail)
    console.log(baseURI)
    var params = {
        Destination: {
        ToAddresses: [`${toEmail}`],
        },
        Message: {
        Body: {
            Text: { Data: "Congratulations on creating a new account. Please click here to verify your email address. This link will be valid for the next 5 minutes - " + baseURI },
        },
    
        Subject: { Data: "Welcome to our cloud storage platform. Please verify your new account" },
        },
        Source: `${fromEmail}`,
    };

return ses.sendEmail(params).promise()
}
