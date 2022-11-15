import {  APIGatewayProxyResult } from "aws-lambda";

export const corsHandler = (result: APIGatewayProxyResult) => {
    result.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': "*"
    }
}