import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return formatJSONResponse({
    books: [
      {
        id: 1,
        name: "Harry Potter 1",
        price: 14,
        author: "J.K. Rowling",
      },
      {
        id: 2,
        name: "Harry Potter 2",
        price: 13.99,
        author: "J.K. Rowling",
      },
    ],
  });
};

export const main = middyfy(getProductsList);
