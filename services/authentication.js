const jwt = require("jsonwebtoken");

const PASS_SECRET = "$Abhishek$$8120";

const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  };

  const token = jwt.sign(payload, PASS_SECRET);
  return token;
};

const validateToken = (token) => {
    const payload = jwt.verify(token, PASS_SECRET);
    return payload;
}


module.exports = {
    createTokenForUser,
    validateToken
};