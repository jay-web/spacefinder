# Welcome to Space finder cloudformation TypeScript project
#### This is backend of the Space finder project, which is completely based AWS serverless architecture. Project has been created using AWS CDK and developed cloud infrastructure in code and then provisioning it through AWS Cloudformation.

* API's are handled by AWS APIGateways.
* CRUD operation are handled by AWS Lambda service.
* Project data are getting stored in AWS DynamoDB. 
* Images are getting stored in S3 bucket.
* Authentication is taking care by AWS Cognito service.

#### To test the project on local development environment, after cloning it your local machine add the config.ts file in test/auth folder. Add the below mentioned configuration data with your own details. Some details will also print out on console when you deploy the code to AWS or you may checkout on AWS cloudformation console of your account after code get successfully deployed.



```
const mainUrl = "replace it with your api endpoint url which you get after deploying the code";

export const Config = {
      REGION: '<your-aws-account-region>',
      USER_POOL_ID: '<your-user-pool-id>',             
      APP_CLIENT_ID: '<your-app-client-id>',
      USER_IDENTITY_POOL_ID: '<your-user-identity-pool-id>',
      TEST_USER_NAME: '<your-account-username>',                      // need to create dummy account to login from AWS Cognito
      TEST_USER_PASSWORD: '<your-account-username-password>',
      SPACE_PHOTO_BUCKET_NAME: '<your-s3-bucket-name>',
      API:{
          baseUrl: mainUrl,
          spaceUrl: `${mainUrl}spaces`
      }
  }
```



The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
