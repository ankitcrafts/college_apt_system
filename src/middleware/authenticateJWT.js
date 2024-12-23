import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// JWT Authentication
const authenticateJWT = (req, res, next) => {
  const authToken = req.headers.authorization?.split(" ")[1];

  if (!authToken) {
    return res.status(401).json({
      message: "Authentication failed: No token provided.",
      status: false,
      code: 401,
      data: null,
    });
  }

  //Verify the JWT Token
  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

    // Now Attach the decoded token data to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        message: "Authentication failed: Invalid token.",
        status: false,
        code: 403,
        data: null,
      });
    }
    return res.status(500).json({
      message: "Internal server error.",
      status: false,
      code: 500,
      data: null,
    });
  }
};

export { authenticateJWT };
