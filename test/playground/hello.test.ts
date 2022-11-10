// import { handler } from "../../services/node-lambdas/hello";
import { APIGatewayProxyEvent } from "aws-lambda";
import { handler as createItem } from "../../services/SpaceFinderLambdas/create";
import { handler as readTable } from "../../services/SpaceFinderLambdas/read";

// handler({}, {});

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        'SpaceFinderId': 'f31dfb60-b8a8-4f80-b4e8-98bb72bc6b74'
    }
} as any;

// * To create new space
// const event = {
//     body:{
//         location: "New Delhi India",
//         place: "Palam"
//     }
// }

// createItem(event as any, {} as any)

readTable(event, {} as any).then((apiResult) => {
    const items = JSON.parse(apiResult.body);
    console.log(2323)
})