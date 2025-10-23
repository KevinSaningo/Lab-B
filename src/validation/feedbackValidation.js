const Joi = require('joi');

const feedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500)
});

module.exports = { feedbackSchema };