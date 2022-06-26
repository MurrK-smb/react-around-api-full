const SUCCESS = 200;
const CREATED_SUCCESS = 201;
const BAD_REQUEST_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

const mongoDbAdress = "mongodb://localhost:27017/aroundb";

const handleServerError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};

module.exports = {
  SUCCESS,
  CREATED_SUCCESS,
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  mongoDbAdress,
  handleServerError,
};
