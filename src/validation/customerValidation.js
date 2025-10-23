const Joi = require('joi');

const customerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(255),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
  password: Joi.string().min(6).required()
});

const customerUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  address: Joi.string().max(255),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/)
});

module.exports = { customerSchema, customerUpdateSchema };