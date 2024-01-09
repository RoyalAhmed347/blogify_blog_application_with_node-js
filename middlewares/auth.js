const { checkToken } = require("../services/auth");

const checkForAuthToken = (tokenName) => {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[tokenName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = checkToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
};

module.exports = { checkForAuthToken };
