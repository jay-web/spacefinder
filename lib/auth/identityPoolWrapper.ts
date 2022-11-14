import { CfnOutput } from "aws-cdk-lib";
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";


export class IdentityPoolWrapper {
    private scope: Construct;
    private userPool: UserPool;
    private userPoolClient : UserPoolClient;

    private identityPool : CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    public adminRole: Role;

    constructor(scope:Construct, userPool: UserPool, userPoolClient: UserPoolClient){
        this.scope = scope;
        this.userPool = userPool;
        this.userPoolClient = userPoolClient;
        this.initialize();
    }


    private initialize(){
         this.initializeIdentityPool();
         this.initializeRoles();
         this.attachRoles();
    }

    // todo: Create Identity Pool
    private initializeIdentityPool(){
        this.identityPool = new CfnIdentityPool(this.scope, "SpaceFinderIdentityPool", {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        })

        // todo: Just to print the identity pool id at the time of deploy
        new CfnOutput(this.scope, "IdentityPoolId", {
            value: this.identityPool.ref
        })
    }

    // todo: InitializeRole IAM Roles for identity Pool
    private initializeRoles(){
        // todo: Create authenticated Role
        // ? Authenticated Role Means - A user authenticating with Amazon Cognito will go through a multi-step process to bootstrap their credentials
        // ? Below code also available at IAM Section in roles-> trust relationship section (if we created role using aws console)

        this.authenticatedRole = new Role(this.scope, "CognitoDefaultAuthenticatedRole", {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals:{
                    "cognito-identity.amazonaws.com:aud": this.identityPool.ref
                },
                "ForAnyValue:StringLike":{
                    "cognito-identity.amazonaws.com:amr": "authenticated"
                }
            },
            "sts:AssumeRoleWithWebIdentity"
            )
        });
         // todo: Below we will add some priviledges to this role, like able to list s3 buckets
        // ? uncomment below code if you want to add more priviledges
        // this.authenticateRole.addToPolicy(new PolicyStatement({

        // }))

        // todo: Create UnAuthenticated Role
        // ? UnAuthenticated role means: Amazon Cognito can support unauthenticated identities by providing a unique identifier and AWS credentials for users who do not authenticate with an identity provider. If your application allows customers to use the application without logging in

        this.unAuthenticatedRole = new Role(this.scope, "CognitoDefaultUnAuthenticatedRole", {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals:{
                    "cognito-identity.amazonaws.com:aud": this.identityPool.ref
                },
                "ForAnyValue:StringLike":{
                    "cognito-identity.amazonaws.com:amr": "unauthenticated"
                }
            },
            "sts:AssumeRoleWithWebIdentity"
            )
        })
        // todo: Below we will add some priviledges to this role, like able to list s3 buckets
        // ? uncomment below code if you want to add more priviledges
        // this.unAuthenticatedRole.addToPolicy(new PolicyStatement({

        // }))

        // todo: Create custom role which is beyond the basic

        this.adminRole = new Role(this.scope, "CognitoAdminRole", {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals:{
                    "cognito-identity.amazonaws.com:aud": this.identityPool.ref
                },
                "ForAnyValue:StringLike":{
                    "cognito-identity.amazonaws.com:amr": "authenticated"
                }
            },
            "sts:AssumeRoleWithWebIdentity"
            )
        });

        // todo: Below we will add some priviledges to this role, like able to list s3 buckets
        this.adminRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions:['s3:ListAllMyBuckets'],
            resources:['*']
        }))

    }

    // todo: Attach all above created roles to identity pool
    private attachRoles(){
        new CfnIdentityPoolRoleAttachment(this.scope, "RolesAttachment", {
            identityPoolId: this.identityPool.ref,
            roles:{
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unAuthenticatedRole.roleArn
            },
            roleMappings:{
                adminsMapping:{
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }




}