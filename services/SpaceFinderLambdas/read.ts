import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'})

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from DynamoDB"
    }

   
    try {
        // todo: If query string is available in event object
        if(event.queryStringParameters){
            if(PRIMARY_KEY! in event.queryStringParameters){
                const KEY_VALUE = event.queryStringParameters[PRIMARY_KEY!];
                const queryResponse = await dbClient.query({
                    TableName: TABLE_NAME!,
                    KeyConditionExpression: "#zz = :zzzz",
                    ExpressionAttributeNames: {
                        "#zz": PRIMARY_KEY!
                      
                    },
                    ExpressionAttributeValues:{
                        ":zzzz": KEY_VALUE
                    }
                }).promise();
                result.body = JSON.stringify(queryResponse)
            }
        }else{
             // todo: To Read entire table
            const response = await dbClient.scan({
                TableName: TABLE_NAME!
            }).promise();
    
            result.body = JSON.stringify(response)
        }
        

    } catch (error) {
        if(error instanceof Error){
            result.body = error.message
        }
    }

    return result;
}

export { handler};