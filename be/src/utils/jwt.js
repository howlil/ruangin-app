const jwt = require("jsonwebtoken");
require('dotenv').config();

function generateToken(idUser) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
 }
  return jwt.sign(
    {
      uuid: idUser,
    },
    process.env.SECRET_KEY,
    { algorithm: "HS512", expiresIn: "24h" }
  );
}

function decodeToken(token) {
  return jwt.verify(token, process.env.SECRET_KEY, {
    algorithms: ["HS512"],
  });
}

module.exports = {
  generateToken,
  decodeToken,
};