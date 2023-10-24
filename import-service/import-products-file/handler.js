'use strict';
const { S3 } = require('aws-sdk');

module.exports.main = async (event) => {
  const s3 = new S3({ region: "eu-central-1", signatureVersion: "v4" });
  const fileName = event.queryStringParameters?.name;

  if (!fileName) {
    return {
      statusCode: 500,
      body: "Name query param is not defined!",
    };
  }

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
