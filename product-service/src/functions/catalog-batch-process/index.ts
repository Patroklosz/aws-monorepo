import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

const event: AWS["functions"]["events"] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": ["CatalogItemsQueue", "Arn"],
        },
        batchSize: 5,
        maximumBatchingWindow: 10,
      },
    },
  ],
};
export default event;
