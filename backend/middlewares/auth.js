const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const ForbiddenError = require("../errors/forbidden-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ForbiddenError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "top-secret-key"
    );
  } catch (err) {
    return next(new ForbiddenError("Authorization Required"));
  }

  req.user = payload;

  return next();
};
