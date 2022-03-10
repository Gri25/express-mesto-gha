const { celebrate, Joi } = require('celebrate');

const validateRegisterId = celebrate({
  body: {
    name: Joi.string().length(24).hex().required(),
  },
});

module.exports = validateRegisterId;
