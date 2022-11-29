import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';


import { AuthorizationType, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './genericTable';

import { AuthorizerWrapper } from './auth/authorizerWrapper';
import { CfnOutput, Fn } from 'aws-cdk-lib';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { WebAppDeployment } from './webAppDeployment';



export class SpaceFinderStack extends cdk.Stack {
  // todo: Create instance of restapi from aws gateway api
  private api = new RestApi(this, 'SpaceFinderApi');
  private authorizer: AuthorizerWrapper;
  private suffix: string;
  private spacesPhotoBucket : Bucket;

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
    this.initializeSuffix();
    this.initializePhotoBucket();
    this.authorizer = new AuthorizerWrapper(this, this.api, this.spacesPhotoBucket.bucketArn);
    new WebAppDeployment(this, this.suffix);



    // todo: Create authorizer and attach the same at line 72 - 76 to our api request

    const optionsWithAuthoizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId
      }
    }

    // todo: Options with cors
    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions:{
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000', 'http://space-finder-web-0eb832199ad3.s3-website-us-east-1.amazonaws.com'],
      },
      

    }

    // todo: Add the Space resource to api
    const spaceResource = this.api.root.addResource("spaces", optionsWithCors);

    // todo: Add the HTTP Methods with lambda integration
    spaceResource.addMethod("POST", this.spaceFinder.createLambdaIntegration, optionsWithAuthoizer);
    spaceResource.addMethod("GET", this.spaceFinder.readLambdaIntegration, optionsWithAuthoizer);
    spaceResource.addMethod("PUT", this.spaceFinder.updateLambdaIntegration, optionsWithAuthoizer);
    spaceResource.addMethod("DELETE", this.spaceFinder.deleteLambdaIntegration, optionsWithAuthoizer);



  }

  // todo: Create suffix to add to the s3 bucket name for the photos to make it unique
  // ? Just extracting last digits of the stack id and using that as suffix
  private initializeSuffix() {
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
    const Suffix = Fn.select(4, Fn.split('-', shortStackId));
    this.suffix = Suffix;
  }

  // todo: Initialize s3 bucket to store spaces photos
  private initializePhotoBucket(){
    this.spacesPhotoBucket = new Bucket(this, 'spaces-photos', {
      bucketName: 'spaces-photos-' + this.suffix,
      cors:[
        {
          allowedMethods:[
            HttpMethods.GET,
            HttpMethods.PUT,
            HttpMethods.HEAD
          ],
          allowedOrigins:['*'],
          allowedHeaders:['*']
        }
      ]
    });

    new CfnOutput(this, "spaces-photos-bucket-name", {
      value: this.spacesPhotoBucket.bucketName
    })
  }
}
