import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';'
// import {join} from 'path';
// import {Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';

import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './genericTable';
// import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
// import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AuthorizerWrapper } from './auth/authorizerWrapper';


export class SpaceFinderStack extends cdk.Stack {
  // todo: Create instance of restapi from aws gateway api
  private api = new RestApi(this, 'SpaceFinderApi');
  private authorizer: AuthorizerWrapper;

  // todo: Create Dynamo DB Table
  private spaceFinder = new GenericTable(this, {
    tableName: "spaceFinder", 
    primaryKey: "spaceId",
    createLambdaPath: 'create',           // ? Create lambda handler file path
    readLambdaPath: 'read',               // ? Read lambda handler file path
    updateLambdaPath: 'update',           // ? Update lambda handler file path
    deleteLambdaPath: 'delete',           // ? Delete lambda handler file path
    secondaryIndexes: ['location']
  
  }
    );

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.authorizer = new AuthorizerWrapper(this, this.api);

    // todo: Create lambda function
    // const helloLambda = new LambdaFunction(this, 'helloLambda', {
    //   runtime: Runtime.NODEJS_16_X,
    //   code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
    //   handler: 'hello.main'
    // })

     // ? Example code =====

    // todo: Create node lambda function and attach to our lambda handler function
    // const helloNodeLambda = new NodejsFunction(this, "helloNodeLambda", {
    //   entry: join(__dirname, '..', 'services', 'node-lambdas', 'hello.ts'),
    //   handler: 'handler'
    // });

    // todo: Create new policy statement to add s3 list bucket action to out lambda function
    // const s3listPolicy = new PolicyStatement();
    // s3listPolicy.addActions('s3:ListAllMyBuckets');
    // s3listPolicy.addResources('*');

    // todo: Attach s3listPolicy to lambda function finally
    // helloNodeLambda.addToRolePolicy(s3listPolicy);

    // todo: hello api integration with lambda service
    // const helloLambdaIntegration = new LambdaIntegration(helloNodeLambda);
    // const helloLambdaResource =  this.api.root.addResource('hello');
    // helloLambdaResource.addMethod('GET', helloLambdaIntegration);

    // ? ----------Example code ends =====

    // todo: Create authorizer and attach the same at line 72 - 76 to our api request

    const optionsWithAuthoizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId
      }
    }

    // todo: Add the Space resource to api
    const spaceResource = this.api.root.addResource("spaces");

    // todo: Add the HTTP Methods with lambda integration
    spaceResource.addMethod("POST", this.spaceFinder.createLambdaIntegration, optionsWithAuthoizer);
    spaceResource.addMethod("GET", this.spaceFinder.readLambdaIntegration, optionsWithAuthoizer);
    spaceResource.addMethod("PUT", this.spaceFinder.updateLambdaIntegration, optionsWithAuthoizer);
    spaceResource.addMethod("DELETE", this.spaceFinder.deleteLambdaIntegration, optionsWithAuthoizer);



  }
}
