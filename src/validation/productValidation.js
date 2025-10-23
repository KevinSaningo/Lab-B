const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z\s]*$/)
    .min(3)
    .max(30)
    .required(),
  desc: Joi.string()
    .regex(/^[a-zA-Z0-9\s]*$/)
    .min(10)
    .max(255),
  image: Joi.string().uri().allow(null),
  price: Joi.number().positive().precision(2),
  stock: Joi.number().integer().positive(),
});

module.exports = { productSchema };