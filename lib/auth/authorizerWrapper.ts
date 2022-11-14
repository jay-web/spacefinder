import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient, CfnUserPoolGroup } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { IdentityPoolWrapper } from "./identityPoolWrapper";

export class AuthorizerWrapper {
    private scope: Construct;
    private api: RestApi;

    private userPool: UserPool;
    private userPoolClient : UserPoolClient;
    public authorizer: CognitoUserPoolsAuthorizer;
    private identityPoolWrapper: IdentityPoolWrapper;

    constructor(scope: Construct, api: RestApi){
        this.scope = scope;
        this.api = api;
        this.initialize();
    }

    private initialize(){
        this.createUserPool();
        this.addUserPoolClient();
        this.createAuthorizer();
        this.initializeIdentityPoolWrapper();
        this.createUserGroup();
       
    }

    // todo : To create the user pool for our users
    private createUserPool(){
        this.userPool = new UserPool(this.scope, "SpaceUserPool", {
            userPoolName: "SpaceUserPool",
            selfSignUpEnabled: true,
            signInAliases:{
                username:true,
                email: true
            }
        });

        // todo: To console the user pool id at the time of deployment
        new CfnOutput(this.scope, "UserPoolId", {
            value: this.userPool.userPoolId
        })
    }

    // todo: To add the user pool client to our user pool
    private addUserPoolClient(){
        this.userPoolClient = this.userPool.addClient("SpaceUserPool-client", {
            userPoolClientName: "SpaceUserPool-client",
            authFlows:{
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            },
            generateSecret: false
        });

        // todo: Just to console the userpool client id at deployment
        new CfnOutput(this.scope, "UserPoolClientId", {
            value: this.userPoolClient.userPoolClientId
        });
    }

    // todo: to create the authorizer to integrate with api
    private createAuthorizer(){
        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, "SpaceUserAuthorizer", {
            cognitoUserPools: [this.userPool],
            authorizerName: "SpaceUserAuthorizer",
            identitySource: 'method.request.header.Authorization'
            
        });
        this.authorizer._attachToApi(this.api);

    }

    // todo: Initilize identity pool wrapper created in identityPoolWrapper class (if required)
    private initializeIdentityPoolWrapper(){
        this.identityPoolWrapper = new IdentityPoolWrapper(this.scope, this.userPool, this.userPoolClient);
    }

    // todo: To create the user group
    private createUserGroup(){
        new CfnUserPoolGroup(this.scope, "admin", {
            groupName: "admin",
            userPoolId: this.userPool.userPoolId,
            roleArn: this.identityPoolWrapper.adminRole.roleArn  // ? Note: Need to create this role in identity pool
        })
    }
}