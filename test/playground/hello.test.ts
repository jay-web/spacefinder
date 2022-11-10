// import { handler } from "../../services/node-lambdas/hello";
import { APIGatewayProxyEvent } from "aws-lambda";
import { handler as createItem } from "../../services/SpaceFinderLambdas/create";
import { handler as readTable } from "../../services/SpaceFinderLambdas/read";
import { handler as updateData } from "../../services/SpaceFinderLambdas/update";

// handler({}, {});


// * Event with data to update to call update request
const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        'SpaceFinderId': 'f31dfb60-b8a8-4f80-b4e8-98bb72bc6b74'
    },
    body:{
        place: "Palam Colony"
    }
} as any;

// * Event with Secondary key as queryString , like location 
// const event: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         'location': 'New Delhi India'
//     }
// } as any;

// * Event with primary key as queryString
// const event: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         'SpaceFinderId': 'f31dfb60-b8a8-4f80-b4e8-98bb72bc6b74'
//     }
// } as any;

// *  Event To create new space
// const event = {
//     body:{
//         location: "New Delhi India",
//         place: "Palam"
//     }
// }

// * Call createItem handler
// createItem(event as any, {} as any)



// * Call readTable handler
// readTable(event, {} as any).then((apiResult) => {
//     const items = JSON.parse(apiResult.body);
//     console.log(2323)
// })
updateData(event , {} as any).then((apiResult) => {
    const items = JSON.parse(apiResult.body);
    console.log(2323)
})
