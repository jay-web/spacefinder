import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';'
import {join} from 'path';
import {Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';

import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './genericTable';

export class SpaceFinderStack extends cdk.Stack {
  // todo: Create instance of restapi from aws gateway api
  private api = new RestApi(this, 'SpaceFinderApi');

  // todo: Create Dynamo DB Table
  private spaceFinderTable = new GenericTable("SpaceFinderTable", "SpaceFinder", this);

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // todo: Create lambda function
    const helloLambda = new LambdaFunction(this, 'helloLambda', {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
      handler: 'hello.main'
    })

    // todo: hello api integration with lambda service
    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource =  this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);



  }
}
