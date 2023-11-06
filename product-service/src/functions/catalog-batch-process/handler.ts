import { SQSEvent } from "aws-lambda";
import { Book, Product, RawProduct, Stock } from "models/book.model";
import { DynamoDB, SNS } from "aws-sdk";

type Body = {
  statusCode: number;
  body: string;
};

function removeBom(array: RawProduct[]): Omit<Book<number>, "id">[] {
  return array.map((obj) => {
    const name = Object.values(obj)[0] as string;
    return {
      name,
      author: obj.author,
      description: obj.description,
      price: parseInt(obj.price),
      count: parseInt(obj.count),
    };
  });
}

const db = new DynamoDB.DocumentClient();
const snsClient = new SNS();

const addItem = async <T>(tableName: string, Item: T) => {
  return await db
    .put({
      TableName: tableName,
      Item,
    })
    .promise();
};

const publish = (message: string) => {
  return snsClient
    .publish({
      Message: message,
      TopicArn:
        "arn:aws:sns:eu-central-1:906118294309:product-service-dev-CreateProductTopic-AZR61TqRT9pR",
    })
    .promise();
};

const catalogBatchProcess = async (event: SQSEvent) => {
  const promises = [];
  for (const record of event.Records) {
    const { body } = JSON.parse(record.body).responsePayload as Body;
    const parsedBody = JSON.parse(body) as RawProduct[];
    const data = removeBom(parsedBody);
    console.log("Body", data);

    for (const obj of data) {
      const id = Math.floor(Math.random() * 1000000);
      promises.push(
        addItem<Product>("Products", {
          id,
          name: obj.name,
          author: obj.author,
          price: obj.price,
          description: obj.description,
        })
      );
      promises.push(
        await addItem<Stock>("Stocks", {
          product_id: id,
          count: obj.count,
        })
      );
    }
  }

  try {
    await Promise.all(promises);
    await publish("Products were added successfully!");
    return {
      statusCode: 200,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err,
      }),
    };
  }
};

export const main = catalogBatchProcess;
