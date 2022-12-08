import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';
import { corsHandler } from '../../../utils/corsHandler';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});


async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from delete lambda"
    }

    corsHandler(result);
    const spaceID = event.queryStringParameters?.[PRIMARY_KEY!];

    try {
        if(spaceID){
            const resultOfDeleteQuery = await dbClient.delete({
                TableName: TABLE_NAME!,
                Key: {
                    [PRIMARY_KEY!] : spaceID
                }
            }).promise();

            result.body = JSON.stringify(resultOfDeleteQuery);
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