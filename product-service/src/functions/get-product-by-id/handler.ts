import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import { Product, Stock } from "models/book.model";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  const db = new DynamoDB.DocumentClient();
  const tableNames = process.env.TABLE_NAMES.split(" ");
  const productId = event.pathParameters?.productId;

  const getItem = async () => {
    const params = {
      TableName: tableNames[0],
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": Number(productId),
      },
    };
    return (await db.query(params).promise())?.Items as unknown as Product[];
  };

  const getItemCount = async () => {
    const params = {
      TableName: tableNames[1],
      KeyConditionExpression: "product_id = :product_id",
      ExpressionAttributeValues: {
        ":product_id": Number(productId),
      },
    };
    return (await db.query(params).promise())?.Items as unknown as Stock[];
  };

  if (!productId) {
    return formatJSONResponse(
      {
        error: "Product id is not found!",
      },
      400
    );
  }

  const product = await getItem();
  const stock = await getItemCount();

  if (!product) {
    return formatJSONResponse(
      {
        error: `Cannot retrieve book with id: ${productId}`,
      },
      404
    );
  }
  return formatJSONResponse({ ...product[0], count: stock[0].count });
};

export const main = middyfy(getProductById);
