import { APIGatewayEvent } from "aws-lambda";

const policyFactory = (principalId: string, effect: "Allow" | "Deny") => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: "arn:aws:execute-api:*:*:*",
        },
      ],
    },
  };
};

const decodeAuthToken = (token: string): { user: string; pwd: string } => {
  const decodedAuth = Buffer.from(token.split(" ")[1], "base64").toString(
    "ascii"
  );
  const userData = decodedAuth.split(":");
  return {
    user: userData[0],
    pwd: userData[1],
  };
};

interface APIGatewayAuthorizerEvent extends APIGatewayEvent {
  identitySource: string[];
}

export const basicAuthorizer = async (event: APIGatewayAuthorizerEvent) => {
  const authorization = event.identitySource[0];

  const userInfo = decodeAuthToken(authorization);

  if (process.env[userInfo.user] === userInfo.pwd) {
    return policyFactory(userInfo.user, "Allow");
  }

  return policyFactory(userInfo.user, "Deny");
};
