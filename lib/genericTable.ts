import { aws_dynamodb, Stack } from "aws-cdk-lib";
import {Table} from "aws-cdk-lib/aws-dynamodb";

export class GenericTable {
    private name: string;
    private primaryKey: string;
    private table : Table;
    private stack : Stack;


    public constructor(name:string, primaryKey: string, stack: Stack){
        this.name = name;
        this.primaryKey = primaryKey;
        this.stack = stack;
        this.initialize();
    }

    private initialize(){
        this.createTable()
    }

    private createTable(){
        this.table = new aws_dynamodb.Table(this.stack, 'SpaceFinderTable',{
            partitionKey: {
                name: this.primaryKey,
                type: aws_dynamodb.AttributeType.STRING
            },
            tableName: this.name
        })
    }
    
}