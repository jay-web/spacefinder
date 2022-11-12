import  {Auth, Amplify } from 'aws-amplify';
import {Config} from "./config";

import { CognitoUser } from '@aws-amplify/auth';

Amplify.configure({
    Auth:{
        mandatorySignIn: false,
        region: Config.REGION,
        userPoolId: Config.USER_POOL_ID,
        userPoolWebClientId: Config.APP_CLIENT_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})

export class AuthService {

    public async login(username:string, password:string){
        const user = await Auth.signIn(username, password) as CognitoUser;
        return user;
    }
}