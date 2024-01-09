const JWT = require("jsonwebtoken");
const secret = "$uper>@Man.347";
const createToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
    fullName: user.fullName,
  };
  const token = JWT.sign(payload, secret);
  return token;
};

const checkToken = (token) => {
  const payload = JWT.verify(token, secret);
  return payload;
};

module.exports = { createToken, checkToken };
