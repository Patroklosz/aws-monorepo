import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
// import { S3 } from "aws-sdk";

const importFileParser: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  _event
) => {
  // const s3 = new S3({ region: "eu-central-1", signatureVersion: "v4" });

  return {
    statusCode: 200,
    body: "Hello World!",
  };
};

export const main = middyfy(importFileParser);
