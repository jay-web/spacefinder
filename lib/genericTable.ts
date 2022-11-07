import { aws_dynamodb, Stack } from "aws-cdk-lib";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { join } from "path";

export interface TableProps {
    tableName:string,
    primaryKey:string,
    createLambdaPath?: string,
    readLambdaPath?: string,
    updateLambdaPath?: string,
    deleteLambdaPath?: string
}

export class GenericTable {
   
    private table : Table;
    private stack : Stack;
    private props: TableProps;

    private createLambda : NodejsFunction | undefined;
    private readLambda : NodejsFunction | undefined;
    private updateLambda: NodejsFunction | undefined;
    private deleteLambda : NodejsFunction | undefined;

    public createLambdaIntegration : LambdaIntegration;
    public readLambdaIntegration : LambdaIntegration;
    public updateLambdaIntegration : LambdaIntegration;
    public deleteLambdaIntegration : LambdaIntegration;


    public constructor(stack: Stack, props: TableProps){
        this.props = props;
        this.stack = stack;
        this.initialize();
    }

    private initialize(){
        this.createTable();
        this.createLambdas();
        this.grantTableRight();
    }

    private createTable(){
        this.table = new aws_dynamodb.Table(this.stack, 'SpaceFinderTable',{
            partitionKey: {
                name: this.props.primaryKey,
                type: aws_dynamodb.AttributeType.STRING
            },
            tableName: this.props.tableName
        })
    }
    
    // todo: Grant table right to lambdas function to take their respective actions
    private grantTableRight(){
        if(this.createLambda){
            this.table.grantWriteData(this.createLambda);
        }
        if(this.readLambda){
            this.table.grantReadData(this.readLambda);
        }
        if(this.updateLambda){
            this.table.grantWriteData(this.updateLambda);
        }
        if(this.deleteLambda){
            this.table.grantWriteData(this.deleteLambda);
        }
    }
    // todo: Create lambda function by calling createSinglelambda function as per passed lambdaPath
    // todo: And then  Integrate it with api 
    private createLambdas(){
        if(this.props.createLambdaPath){
            this.createLambda = this.createSingleLambda(this.props.createLambdaPath);
            this.createLambdaIntegration = new LambdaIntegration(this.createLambda)
        }
        if(this.props.readLambdaPath){
            this.readLambda = this.createSingleLambda(this.props.readLambdaPath);
            this.readLambdaIntegration = new LambdaIntegration(this.readLambda);
        }
        if(this.props.updateLambdaPath){
            this.updateLambda = this.createSingleLambda(this.props.updateLambdaPath);
            this.updateLambdaIntegration = new LambdaIntegration(this.updateLambda);
        }
        if(this.props.deleteLambdaPath){
            this.deleteLambda = this.createSingleLambda(this.props.deleteLambdaPath);
            this.deleteLambdaIntegration = new LambdaIntegration(this.deleteLambda);
        }
    }

    // todo: Create single function to create all types of lambdas
    // * @params - pass the handler file name only
    private createSingleLambda(lambdaName: string): NodejsFunction {
        let lambdaId = `${this.props.tableName}-${lambdaName}`;
        return new NodejsFunction(this.stack, lambdaId, {
            entry: join(__dirname,'..', 'services', 'SpaceFinderLambdas', lambdaName+'.ts'),
            handler: 'handler',
            functionName: lambdaId,
            environment:{
                TABLE_NAME: this.props.tableName,
                PRIMARY_KEY: this.props.primaryKey
            }
        })
    }
    
}