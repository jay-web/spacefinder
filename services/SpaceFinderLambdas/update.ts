import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';
import { corsHandler } from '../../utils/corsHandler';
import { generateRequestBody } from '../../utils/generateRequestBody';



const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});


async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from Update lambda"
    }
    corsHandler(result);

    const requestBody = generateRequestBody(event);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];

    try {
        if(requestBody && spaceId){
            const requestBodyKey = Object.keys(requestBody)[0];
            const requestBodyValue = requestBody[requestBodyKey];

            const updateResult = await dbClient.update({
                TableName: TABLE_NAME!,
                Key: {
                    [PRIMARY_KEY!]: spaceId
                },
                UpdateExpression: 'set #zzzNew = :new',
                ExpressionAttributeNames:{
                    '#zzzNew': requestBodyKey 
                },
                ExpressionAttributeValues:{
                    ':new' : requestBodyValue
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();

            result.body = JSON.stringify(updateResult)
        }
    } catch (error) {
        if(error instanceof Error){
            result.statusCode = 500;
            result.body = error.message;
        }
    }


    return result;
}


export {handler};