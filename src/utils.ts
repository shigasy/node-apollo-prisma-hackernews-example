const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3some";

const getTokenPayload = (token) => {
  return jwt.verify(token, APP_SECRET, (error, decodedToken) => {
    if (error) {
      throw new Error(error);
    } else {
      return decodedToken;
    }
  });
};

const getUserId = (req, authToken): number => {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return Number(userId);
    }
  }
  if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return Number(userId);
  }

  throw new Error("Not authenticated");
};

export { APP_SECRET, getUserId };
