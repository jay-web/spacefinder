import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';'
import {join} from 'path';
import {Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';

import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './genericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class SpaceFinderStack extends cdk.Stack {
  // todo: Create instance of restapi from aws gateway api
  private api = new RestApi(this, 'SpaceFinderApi');

  // todo: Create Dynamo DB Table
  private spaceFinderTable = new GenericTable("SpaceFinderTable", "SpaceFinder", this);

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // todo: Create lambda function
    // const helloLambda = new LambdaFunction(this, 'helloLambda', {
    //   runtime: Runtime.NODEJS_16_X,
    //   code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
    //   handler: 'hello.main'
    // })

    // todo: Create node lambda function 
    const helloNodeLambda = new NodejsFunction(this, "helloNodeLambda", {
      entry: join(__dirname, '..', 'services', 'node-lambdas', 'hello.ts'),
      handler: 'handler'
    });

    // todo: Create new policy statement to add s3 list bucket action to out lambda function
    const s3listPolicy = new PolicyStatement();
    s3listPolicy.addActions('s3:ListAllMyBuckets');
    s3listPolicy.addResources('*');

    // todo: Attach s3listPolicy to lambda function finally
    helloNodeLambda.addToRolePolicy(s3listPolicy);

    // todo: hello api integration with lambda service
    const helloLambdaIntegration = new LambdaIntegration(helloNodeLambda);
    const helloLambdaResource =  this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);



  }
}
