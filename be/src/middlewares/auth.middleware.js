const prisma = require("../configs/db.js");
const { decodeToken } = require("../utils/jwt.js");

const authenticate = async (req, res, next) => {
  try {
    const token = req.get("Authorization");

    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const extractedToken = token.substr(7);
    if (!extractedToken || extractedToken === "null") {
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    let claims;
    try {
      claims = decodeToken(extractedToken);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }


    if (!claims || !claims.uuid ) {
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: claims.uuid },
      include: { token: true }, 
    });

    if (!user) {
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const sessionToken = await prisma.token.findFirst({
      where: {
        token: extractedToken,
        user_id: claims.uuid,
      },
    });

    if (!sessionToken) {
      return res.status(401).json({
        message: "Session expired or invalid, please login again",
      });
    }

    req.user = user;
    req.sessionToken = sessionToken;

    next();
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during authentication",
    });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = { authenticate,authorize };