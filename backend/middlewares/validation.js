const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message("This field must contain a valid email")
      .messages({
        "string.empty": 'The "email" field must be filled in',
      }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum lenght of the "name" field is 2',
      "string.max": 'The maximum lenght of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    about: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum lenght of the "about" field is 2',
      "string.max": 'The maximum lenght of the "about" field is 30',
      "string.empty": 'The "about" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
    email: Joi.string()
      .required()
      .email()
      .message("The email field must contain a valid email")
      .messages({
        "string.empty": 'The "email" field must be filled in',
      }),
    avatar: Joi.string()
      .custom(validateURL)
      .message('The "avatar" field must contain a valid URL')
      .messages({
        "string.empty": 'The "avatar" field must be filled in',
      }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().message("The id is invalid").messages({
      "string.empty": 'The "Id" field must be filled in',
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().message("Invalid ID").messages({
      "string.empty": 'The "Id" field must be filled in',
    }),
  }),
});

const validateProfile = celebrate({
  body: {
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum lenght of the "name" field is 2',
      "string.max": 'The maximum lenght of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    about: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum lenght of the "about" field is 2',
      "string.max": 'The maximum lenght of the "about" field is 30',
      "string.empty": 'The "about" field must be filled in',
    }),
  },
});

const avatarValidation = celebrate({
  body: {
    avatar: Joi.string()
      .required()
      .custom(validateURL)
      .message('The "avatar" field must be a valid URL')
      .messages({
        "string.empty": 'The "avatar" field must be filled in',
      }),
  },
});

const createCardValidation = celebrate({
  body: {
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum lenght of the "name" field is 2',
      "string.max": 'The maximum lenght of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    link: Joi.string()
      .required()
      .custom(validateURL)
      .message('The "link" field must contain a valid URL')
      .messages({
        "string.empty": 'The "link" field must be filled in',
      }),
  },
});

module.exports = {
  validateAuthentication,
  validateUserCreation,
  validateUserId,
  validateCardId,
  validateProfile,
  avatarValidation,
  createCardValidation,
};
