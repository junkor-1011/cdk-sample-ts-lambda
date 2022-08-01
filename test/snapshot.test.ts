import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TestAppStack } from '../lib/test-app-stack';
import { TestPipelineStack } from '../lib/test-pipeline-stack';

describe('snapshot test', () => {
  it("CdkPipelines Stack's Snapshot test", () => {
    const app = new cdk.App();
    const stack = new TestPipelineStack(app, 'TestPipelineStack', { projectName: 'sample-lambda' });
    const template = Template.fromStack(stack).toJSON();

    expect(template).toMatchSnapshot();
  });
  it("TestApp Stack's Snapshot test", () => {
    const app = new cdk.App();
    const stack = new TestAppStack(app, 'TestAppStack', { projectName: 'sample-lambda' });
    const template = Template.fromStack(stack).toJSON();

    expect(template).toMatchSnapshot();
  });
});
