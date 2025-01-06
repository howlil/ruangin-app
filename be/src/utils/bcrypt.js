const bcrypt = require("bcrypt");

async function checkPassword(requestPassword, userPassword) {
  try {
    return await bcrypt.compare(requestPassword, userPassword);
  } catch (error) {
    throw new Error(error);
  }
}

async function encryptPassword(password) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Password encryption failed");
  }
}

module.exports = { checkPassword, encryptPassword };  