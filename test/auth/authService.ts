import  {Auth, Amplify } from 'aws-amplify';
import {Config} from "./config";
import * as AWS from "aws-sdk";
import { CognitoUser } from '@aws-amplify/auth';
import { Credentials } from 'aws-sdk';

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

    public async getAWSTempCredentials(user: CognitoUser) {
        const cognitoIdentityPool = `cognito-idp.${Config.REGION}.amazonaws.com/${Config.USER_POOL_ID}`;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: Config.USER_IDENTITY_POOL_ID,
            Logins:{
                [cognitoIdentityPool]: user.getSignInUserSession()!.getIdToken().getJwtToken()
            }
        },
        {
            region: Config.REGION
        })

        await this.refreshCredentials();
    }

    private async refreshCredentials(): Promise<void> {
        return new Promise((resolve, reject) => {
            (AWS.config.credentials as Credentials).refresh((error) => {
                if(error){
                    reject(error);
                }else{
                    resolve()
                }
            })
        })
    }


}