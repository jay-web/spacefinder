import  { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';

import { generateRandomId } from '../../utils/generateRandomId';
import { InputValidator, MissingFieldError } from '../../utils/inputValidators';
import { generateRequestBody } from "../../utils/generateRequestBody";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});

// ? Main lambda handler function to add the data into dynamoDB table

async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from lambda db creation"
    }

    
    try{
        // todo: set the item using REQUEST body
        const item = generateRequestBody(event);
        item.spaceId = generateRandomId();
        InputValidator(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()

        result.body = `Created item with id ${item.spaceId}`
    }catch(error){
        if(error instanceof Error){
            if (error instanceof MissingFieldError) {
                result.statusCode = 403;
                
            }else{
                result.statusCode = 500;
            }
            result.body = error.message
        }
        
    }
    

    return result;
}


export { handler }