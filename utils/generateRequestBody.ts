import { APIGatewayProxyEvent } from "aws-lambda";

export function generateRequestBody(event: APIGatewayProxyEvent) {
   return typeof event.body == 'object' ? event.body : JSON.parse(event.body);
}