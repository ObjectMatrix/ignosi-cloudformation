const AWS = require('aws-sdk')
// Create client outside of handler to reuse
const lambda = new AWS.Lambda()
const s3 = new AWS.S3();
const sns = new AWS.SNS();
// arn:aws:sns:us-east-1:694563893114:ignosi-sns


exports.handler = async (event, context, callback) => {
    //s3 bucket read
    let data = null
    try {
        const params = {
            Bucket: 'ignosi',
            Key: 'entry/astabquestionentry.json',
        };
        
        data = await s3.getObject(params).promise();
         console.log(data.Body.toString('utf-8'))
    } catch (error) {
        throw new Error(`Could not retrieve file from S3: ${error.message}`)
    }
    // sns
    // var snsParams = {
    //     Message: event.queryStringParameters.skillname, 
    //     Subject: "ignosi",
    //     TopicArn: "arn:aws:sns:us-east-1:694563893114:ignosi-sns"
    // };
    
    // try {
    // sns.publish(snsParams, context.done)
    // } catch(e) {
    //     throw new Error(`Could not publish to SNS-IGNOSI ${e.message}`)
    // }
    

    const response = {
        statusCode: 200,
        // body: data.Body.toString('utf-8'),
        //body: event.queryStringParameters.skillname,
    };
    callback(null, response);
    // return response;
};
