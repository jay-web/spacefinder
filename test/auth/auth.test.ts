import {AuthService} from "./authService";
import { Config } from "./config";
import * as AWS from "aws-sdk";


async function callJWTToken(){
    const authService = new AuthService();

    const user = await authService.login(Config.TEST_USER_NAME, Config.TEST_USER_PASSWORD);
    await authService.getAWSTempCredentials(user);
    const someCredentials = AWS.config.credentials;
    const a = 5;


}


callJWTToken();