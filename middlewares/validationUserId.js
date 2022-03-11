const { celebrate, Joi } = require('celebrate');

const validationUserId = celebrate({
  body: {
    id: Joi.string().length(24).hex().required(),
  },
});

module.exports = validationUserId;
