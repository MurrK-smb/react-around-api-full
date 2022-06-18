const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  CREATED_SUCCESS,
  NOT_FOUND_ERROR,
  SUCCESS,
} = require("../utils/constants");

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require("../errors/unauthorized-err");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS).send(users))
    .catch(next);
};

const getProfile = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError("User ID not found"))
    .then((user) => {
      res.status(SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => new NotFoundError("User with this ID does not exist"))
    .then((user) => {
      res.status(SUCCESS).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("This email is already in use");
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(CREATED_SUCCESS).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")}`
          )
        );
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => new NotFoundError("User with this ID does not exist"))
    .then((user) => {
      res.status(SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("User with this ID does not exist"))
    .then((user) => {
      res.status(SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "top-secret-key",
        { expiresIn: "7d" }
      );
      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

module.exports = {
  getUsers,
  getProfile,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUser,
};
