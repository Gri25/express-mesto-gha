const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validationPatchAvatar = celebrate({
  body: {
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Не корректно введен Email!');
    }),
  },
});

module.exports = validationPatchAvatar;
