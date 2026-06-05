const Joi = require('joi');

const teamSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
});

const addMemberSchema = Joi.object({
    email: Joi.string().email().required(),
});

module.exports = { teamSchema, addMemberSchema };