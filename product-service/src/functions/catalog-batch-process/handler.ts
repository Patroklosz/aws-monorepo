import { SQSEvent } from "aws-lambda";

const catalogBatchProcess = (event: SQSEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};

export const main = catalogBatchProcess;
