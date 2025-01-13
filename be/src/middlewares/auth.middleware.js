const prisma = require("../configs/db.js");
const { decodeToken } = require("../utils/jwt.js");
const { logger } = require('../apps/logging.js');

const authenticate = async (req, res, next) => {
  try {
    const token = req.get("Authorization");

    // Log authentication attempt
    logger.info('Authentication attempt', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    if (!token || !token.startsWith("Bearer")) {
      logger.warn('Missing or invalid token format', {
        token: token ? 'Present' : 'Missing',
        path: req.path
      });
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const extractedToken = token.substr(7);
    if (!extractedToken || extractedToken === "null") {
      logger.warn('Empty or null token', {
        path: req.path
      });
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    let claims;
    try {
      claims = decodeToken(extractedToken);
      logger.debug('Token decoded successfully', {
        uuid: claims.uuid,
        path: req.path
      });
    } catch (error) {
      logger.error('Token decode error', {
        error: error.message,
        stack: error.stack,
        path: req.path
      });
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    if (!claims || !claims.uuid) {
      logger.warn('Invalid claims in token', {
        claims: claims ? 'Present but invalid' : 'Missing',
        path: req.path
      });
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const user = await prisma.pengguna.findUnique({
      where: { id: claims.uuid },
      include: { token: true },
    });

    if (!user) {
      logger.warn('User not found', {
        uuid: claims.uuid,
        path: req.path
      });
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const sessionToken = await prisma.token.findFirst({
    where: {
        token: extractedToken,
        pengguna_id: claims.uuid,
      },
    });

    if (!sessionToken) {
      logger.warn('Invalid session token', {
        uuid: claims.uuid,
        path: req.path
      });
      return res.status(401).json({
        message: "Session expired or invalid, please login again",
      });
    }

    req.user = user;
    req.sessionToken = sessionToken;

    logger.info('Authentication successful', {
      uuid: user.id,
      role: user.role,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Authentication error', {
      error: error.message,
      stack: error.stack,
      path: req.path
    });
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
    logger.debug('Authorization check', {
      userRole: req.user.role,
      requiredRoles: roles,
      path: req.path
    });
    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed', {
        userRole: req.user.role,
        requiredRoles: roles,
        userId: req.user.id,
        path: req.path
      });
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    logger.info('Authorization successful', {
      userRole: req.user.role,
      userId: req.user.id,
      path: req.path
    });
    next();
  };
};

module.exports = { authenticate, authorize };