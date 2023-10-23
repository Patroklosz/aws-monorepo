import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { S3 } from "aws-sdk";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  const s3 = new S3({ region: "eu-central-1", signatureVersion: "v4" });
  const fileName = event.queryStringParameters?.name;

  if (!fileName) {
    return {
      statusCode: 500,
      body: "Name query param is not defined!",
    };
  }

  console.log("Key", fileName);

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  const url = await s3.getSignedUrlPromise("putObject", params);

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "OPTIONS, GET, PUT",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({ url }),
  };
};

export const main = middyfy(importProductsFile);
