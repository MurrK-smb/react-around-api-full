const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jacques Cousteau",
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Explorer",
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    required: [true, "url required"],
    validate: {
      validator: (v) => validator.isURL(v),
      message: "This field must contain a valid link",
    },
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "This field must contain a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUser = function findUser(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

userSchema.methods.toJSON = function () {
  const { password, ...obj } = this.toObject();
  return obj;
};

module.exports = mongoose.model("user", userSchema);
