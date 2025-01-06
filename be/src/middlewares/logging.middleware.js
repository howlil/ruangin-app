const { logger } = require("../apps/logging.js");

const logMiddleware = (req, res, next) => {
  const { body, params, query, method, originalUrl } = req;

  logger.info({
    message: "Request received",
    method,
    url: originalUrl,
    params,
    query,
    body,
  });

  const originalSend = res.send;

  res.send = function (body) {
    const contentType = res.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      let responseData;
      try {
        responseData = JSON.parse(body);
      } catch (e) {
        logger.error({
          message: "Failed to parse response body",
          error: e.message,
          body,
        });
        return originalSend.call(this, body);
      }

      const { data, errors } = responseData;

      const obj = {
        message: "Response sent",
        request: {
          method: method,
          url: originalUrl,
        },
        status: res.statusCode,
      };

      if (data) {
        if (Array.isArray(data)) {
          let temp = [];
          for (const item of data) {
            temp.push(maskingLog(item));
          }
          obj.data = temp;
        } else {
          obj.data = maskingLog(data);
        }
      } else if (errors) {
        obj.errors = maskingLog(errors);
      } else {
        obj.message = "Response has no data or errors";
      }

      logger.info(obj);
    }

    return originalSend.call(this, body);
  };

  next();
};

const maskingLog = (data) => {

  if (typeof data === "object" && data !== null) {
    const maskedData = { ...data };
    if (maskedData.password) maskedData.password = "***MASKED***";
    if (maskedData.ssn) maskedData.ssn = "***MASKED***";
    return maskedData;
  }
  return data;
};

module.exports = { logMiddleware };