const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateRegisterUser = celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Не корректно введен URL!');
    }),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Не корректно введен Email!');
    }),
    password: Joi.string().required(),
  },
});

module.exports = validateRegisterUser;
