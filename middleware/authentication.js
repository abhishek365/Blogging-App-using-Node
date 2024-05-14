const { validateToken } = require("../services/authentication");

const checkAuth = (cookieName) => {
  return (req, res, next) => {
    const cookieToken = req.cookies[cookieName];
    if (!cookieToken) return next();

    const userPayload = validateToken(cookieToken);
    if (!userPayload) return next();

    req.user = userPayload;
    return next();
  };
};

module.exports = { checkAuth };
