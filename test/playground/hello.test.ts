// import { handler } from "../../services/node-lambdas/hello";
import { handler as createItem } from "../../services/SpaceFinderLambdas/create";
import { handler as readTable } from "../../services/SpaceFinderLambdas/read";

// handler({}, {});

const event = {
    body:{
        location: "New Delhi India",
        place: "Palam"
    }
}

// createItem(event as any, {} as any)

readTable({} as any, {} as any).then((apiResult) => {
    const items = JSON.parse(apiResult.body);
    console.log(2323)
})