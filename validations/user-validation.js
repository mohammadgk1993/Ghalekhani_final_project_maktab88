const Joi = require("joi");


const userValidationSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d).+$/).min(8).required(),
  phoneNumber: Joi.string().regex(/^(\+98)9\d{9}$/).required()
//   gender: Joi.string().valid("male","female")
});

module.exports = { userValidationSchema };