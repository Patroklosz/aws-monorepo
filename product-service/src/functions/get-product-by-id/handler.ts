import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { books } from "../../content/books.json";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  const productId = event.pathParameters?.productId;

  if (!productId) {
    return formatJSONResponse(
      {
        error: "Product id is not found!",
      },
      400
    );
  }

  const book = books.find((b) => b.id === Number(productId));

  if (!book) {
    return formatJSONResponse(
      {
        error: `There is no book with id ${productId}`,
      },
      404
    );
  }
  return formatJSONResponse(book);
};

export const main = middyfy(getProductById);
