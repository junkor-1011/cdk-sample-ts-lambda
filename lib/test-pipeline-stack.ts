import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

export interface CustomizedProps extends StackProps {
  projectName: string;
}

export class TestPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomizedProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const repo = new codecommit.Repository(this, 'Repository', {
      repositoryName: 'test-app-pipeline-repo',
      description: 'test for cdk pipeline',
    });
  }
}
