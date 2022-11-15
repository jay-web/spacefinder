import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { corsHandler } from "../../utils/corsHandler";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

const dbClient = new DynamoDB.DocumentClient({ region: "us-east-1" });

// ? Main lambda handler function to read the data from dynamoDB

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DynamoDB",
  };

  corsHandler(result);
  try {
    // todo: If query string is available in event object
    if (event.queryStringParameters) {
        // todo: If primay key is available in query string
      if (PRIMARY_KEY! in event.queryStringParameters) {
        result.body = await queryWithPrimarykeyPartition(event.queryStringParameters);
      }else{
        // todo: If no primary key is avalable and, any secondary index is available in query string
        result.body = await queryWithSecondaryPartition(event.queryStringParameters);

      }
    } else {
      // todo: To Read entire table
      result.body = await scanTable(); // ? declared at line 51
    }
  } catch (error) {
    if (error instanceof Error) {
      result.statusCode = 500;
      result.body = error.message;
    }
  }

  return result;
}


// ? Helper functions =======================

async function queryWithSecondaryPartition(
    queryParams: APIGatewayProxyEventQueryStringParameters
  ) {
    const QUERY_KEY = Object.keys(queryParams)[0];
    const QUERY_VALUE = queryParams[QUERY_KEY];
    const queryResponse = await dbClient
      .query({
        TableName: TABLE_NAME!,
        IndexName: QUERY_KEY,
        KeyConditionExpression: "#zz = :zzzz",
        ExpressionAttributeNames: {
          "#zz": QUERY_KEY,
        },
        ExpressionAttributeValues: {
          ":zzzz": QUERY_VALUE,
        },
      })
      .promise();
  
    return JSON.stringify(queryResponse);
  }

async function queryWithPrimarykeyPartition(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const KEY_VALUE = queryParams[PRIMARY_KEY!];
  const queryResponse = await dbClient
    .query({
      TableName: TABLE_NAME!,
      KeyConditionExpression: "#zz = :zzzz",
      ExpressionAttributeNames: {
        "#zz": PRIMARY_KEY!,
      },
      ExpressionAttributeValues: {
        ":zzzz": KEY_VALUE,
      },
    })
    .promise();

  return JSON.stringify(queryResponse);
}

async function scanTable() {
  const response = await dbClient
    .scan({
      TableName: TABLE_NAME!,
    })
    .promise();

  return JSON.stringify(response);
}

export { handler };
