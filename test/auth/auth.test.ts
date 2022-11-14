import {AuthService} from "./authService";
import { Config, ConfigNormal } from "./config";
import * as AWS from "aws-sdk";

AWS.config.region = Config.REGION;

// todo: this is just to get list of all buckets using identity pool temp credentials
// ? if user is not authorized using s3 aws service from identity pool, so it will throw error
async function getAllBuckets(){
    let buckets;
    try {
        buckets = new AWS.S3().listBuckets().promise();
    } catch (error) {
        buckets = undefined;
    }
    return buckets;
}

async function callJWTToken(){
    const authService = new AuthService();
    
    // ? Change below Config to ConfigNormal to test with normal user instead of admin 
    const user = await authService.login(Config.TEST_USER_NAME, Config.TEST_USER_PASSWORD);
    await authService.getAWSTempCredentials(user);
    const someCredentials = AWS.config.credentials;
    const buckets = await getAllBuckets();
    const a = 5;


}


callJWTToken();