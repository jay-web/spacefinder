import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'})

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from DynamoDB"
    }

    try {
        const response = await dbClient.scan({
            TableName: TABLE_NAME!
        }).promise();

        result.body = JSON.stringify(response)

    } catch (error) {
        if(error instanceof Error){
            result.body = error.message
        }
    }

    return result;
}

export { handler};