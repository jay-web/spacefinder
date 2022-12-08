import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent, context: Context ): Promise<APIGatewayProxyResult> => {

    let result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ""
    }

    return result;
}