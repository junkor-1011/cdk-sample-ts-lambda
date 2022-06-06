/* eslint-disable @typescript-eslint/no-unused-vars */

import { Duration, Stack, StackProps, aws_iam as iam, aws_apigateway as apigateway, DockerImage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime, DockerImageFunction, DockerImageCode } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface CustomizedProps extends StackProps {
  projectName: string;
}

export class TestAppStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomizedProps) {
    super(scope, id, props);

    const iamRoleForLambda = new iam.Role(this, 'iamRoleForLambda', {
      roleName: `${props.projectName}-lambda-role`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });

    const helloLambda = new NodejsFunction(this, 'Hello', {
      entry: 'functions/hello/get.ts',
      handler: 'lambdaHandler',
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(30),
      role: iamRoleForLambda,
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
      memorySize: 128,
    });

    const helloLambdaContainer = new DockerImageFunction(this, 'HelloContainer', {
      code: DockerImageCode.fromImageAsset('functions/hello-container'),
      timeout: Duration.seconds(60),
      role: iamRoleForLambda,
      memorySize: 256,
    });

    const helloApi = new apigateway.RestApi(this, 'helloApigateway', {
      restApiName: `${props.projectName}-apigateway`,
    });

    const sample = helloApi.root.addResource('hello');
    const courseSearchIntegration = new apigateway.LambdaIntegration(helloLambda);
    sample.addMethod('GET', courseSearchIntegration);

    const sampleContainer = helloApi.root.addResource('hello-container');
    sampleContainer.addMethod('GET', new apigateway.LambdaIntegration(helloLambdaContainer));
  }
}
