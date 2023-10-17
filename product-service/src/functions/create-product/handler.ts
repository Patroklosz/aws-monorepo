import {
  formatJSONResponse,
  type ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import { Product, Stock } from "models/book.model";

const createProduct: ValidatedEventAPIGatewayProxyEvent<Product> = async (
  event
) => {
  const body = event.body as {
    name: string;
    price: number;
    count: number;
    description: string;
  };

  const db = new DynamoDB.DocumentClient();

  const addItem = async <T>(tableName: string, Item: T) => {
    return await db
      .put({
        TableName: tableName,
        Item,
      })
      .promise();
  };

  const itemId = Math.floor(Math.random() * 1000000);
  await addItem<Product>("Products", {
    id: itemId,
    name: body.name,
    author: "unknown",
    description: body.description,
    price: body.price,
  });
  await addItem<Stock>("Stocks", {
    product_id: itemId,
    count: body.count,
  });

  return formatJSONResponse({});
};

export const main = middyfy(createProduct);
