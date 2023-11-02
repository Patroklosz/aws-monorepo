import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/get-products-list";
import getProductById from "@functions/get-product-by-id";
import createProduct from "@functions/create-product";
import catalogBatchProcess from "@functions/catalog-batch-process";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "eu-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      TABLE_NAMES: "Products Stocks",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*", "SNS:Publish"],
        Resource: "*",
      },
    ],
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: false,
      exclude: [],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
          VisibilityTimeout: 30,
        },
      },
      CreateProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          DisplayName: "createProductTopic",
        },
      },
      CreateProductTopicEmailSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          TopicArn: {
            Ref: "CreateProductTopic",
          },
          Endpoint: "martin_csomai@epam.com",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
