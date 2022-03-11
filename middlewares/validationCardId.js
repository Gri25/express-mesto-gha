const { celebrate, Joi } = require('celebrate');

const validationCardId = celebrate({
  body: {
    id: Joi.string().length(24).hex().required(),
  },
});

module.exports = validationCardId;
