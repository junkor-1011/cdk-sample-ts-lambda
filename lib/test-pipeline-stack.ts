import { Stack, StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as pipelines from 'aws-cdk-lib/pipelines';

import { TestAppStack } from '../lib/test-app-stack';

export interface CustomizedProps extends StackProps {
  projectName: string;
}

const projectName = 'sample-lambda';

export class TestPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomizedProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const repo = new codecommit.Repository(this, 'Repository', {
      repositoryName: 'test-app-pipeline-repo',
      description: 'test for cdk pipeline',
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.codeCommit(repo, 'main'),
        commands: ['yarn', 'yarn build', 'yarn cdk synth'],
      }),
      codeBuildDefaults: {
        buildEnvironment: {
          privileged: true,
        },
      },
    });
    pipeline.addStage(new ApplicationStage(this, 'Prod'));
  }
}

class ApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new TestAppStack(this, 'TestAppStack', {
      projectName,
    });
  }
}
