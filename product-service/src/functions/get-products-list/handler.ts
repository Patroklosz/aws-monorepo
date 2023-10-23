import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import { Product, Stock } from "../../../models/book.model";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  const docClient = new DynamoDB.DocumentClient();

  const tableNames = process.env.TABLE_NAMES.split(" ");

  const scan = async (tableName: string) => {
    return docClient
      .scan({
        TableName: tableName,
      })
      .promise();
  };

  const products = (await scan(tableNames[0]))?.Items as Product[];
  const stocks = (await scan(tableNames[1]))?.Items as Stock[];

  return formatJSONResponse({
    books:
      products?.map((product) => ({
        ...product,
        count: stocks.find((s) => s.product_id === product.id)?.count ?? 0,
      })) ?? [],
  });
};

export const main = middyfy(getProductsList);
