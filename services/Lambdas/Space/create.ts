import  { APIGateway, DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';

import { generateRandomId } from '../../../utils/generateRandomId';
import { SpaceInputValidator, MissingFieldError } from '../../../utils/inputValidators';
import { generateRequestBody } from "../../../utils/generateRequestBody";
import { corsHandler } from '../../../utils/corsHandler';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});

// ? Main lambda handler function to add the data into dynamoDB table

async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from lambda db creation"
    }


    corsHandler(result);

    // todo: Check whether user is admin or not
    if(!isAuthorizedToCreateSpace(event)){
        result.statusCode = 401,
        result.body = "You are NOT authorized to create new space 🔐";
        return result;
    }
    
    try{
        // todo: set the item using REQUEST body
        const item = generateRequestBody(event);
        item.spaceId = generateRandomId();
        SpaceInputValidator(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()

        result.body = `Created item with id ${item.spaceId} `
        
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

// ? Helper function to check whether user is from admin group or not

function isAuthorizedToCreateSpace(event: APIGatewayProxyEvent) {
    const group = event.requestContext.authorizer?.claims['cognito:groups'];
    if(group){
        return (group as string).includes('admin')
    }else{
        return false;
    }
}


export { handler }