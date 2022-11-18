import {  APIGatewayProxyResult } from "aws-lambda";

export const corsHandler = (result: APIGatewayProxyResult) => {
    result.headers = {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": "true"
    }
    
}   