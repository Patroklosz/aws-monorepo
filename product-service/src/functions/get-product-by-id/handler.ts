import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { books } from "../../content/books.json";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  const productId = event.pathParameters?.productId;

  if (!productId) {
    return formatJSONResponse({
      status: 400,
      error: "Product id is not found!",
    });
  }

  const book = books.find((b) => b.id === Number(productId));

  if (!book) {
    return formatJSONResponse({
      status: 404,
      error: `There is no book with id ${productId}`,
    });
  }
  return formatJSONResponse(book);
};

export const main = middyfy(getProductById);
