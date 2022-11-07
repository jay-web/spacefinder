import  { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {v4} from "uuid";


const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});


async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from lambda db creation"
    }

    // todo: set the item using REQUEST body
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    item.SpaceFinderId = v4();
    

    try{
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()

        result.body = `Created item with id ${item.SpaceFinderId}`
    }catch(error){
        if (error instanceof Error) {
            result.body = error.message
        }
    }
    

    return result;
}


export { handler }