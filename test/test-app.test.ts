import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as TestApp from '../lib/test-app-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/test-app-stack.ts
test('Lambda Function: Hello Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new TestApp.TestAppStack(app, 'MyTestStack', {
    projectName: 'fine-grained-assertions-test',
  });
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);

  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);

  template.resourceCountIs('AWS::ApiGateway::Method', 1);

  template.hasResourceProperties('AWS::ApiGateway::Resource', {
    PathPart: 'hello',
  });

  //   template.hasResourceProperties('AWS::SQS::Queue', {
  //     VisibilityTimeout: 300
  //   });
});
