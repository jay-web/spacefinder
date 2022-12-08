import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { corsHandler } from "../../../utils/corsHandler";
import { generateRandomId } from "../../../utils/generateRandomId";
import { generateRequestBody } from "../../../utils/generateRequestBody";
import {ReservationInputValidator, MissingFieldError} from "../../../utils/inputValidators";
import { DynamoDB} from "aws-sdk";


const TABLE_NAME = process.env.RESERVATION_TABLE_NAME;

const dbClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});

 const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {

    let result: APIGatewayProxyResult = {
        statusCode:200,
        body: ""
    }

    // * Inject corhandler into request
    corsHandler(result);

    try {
        console.log("Event ", event);
        let item = generateRequestBody(event);
        item.reservationId = generateRandomId();        // ? Create reservation id
        let user = getUser(event);
        item.user = user                                // ? Set user info to item object
        item.status = "PENDING"
        ReservationInputValidator(item);                // ? Validate the item

        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise();

        result.body = `Space has been reserved with id of ${item.reservationId} and status is ${item.status}`

    } catch (error) {
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

function getUser(event: APIGatewayProxyEvent) {
        const userDetails = event.requestContext.authorizer?.claims;
        const user = {
            sub: userDetails['sub'],
            username: userDetails['cognito:username']
        }
        
        if(user){
            return user;
        }

        return null
}

export { handler }