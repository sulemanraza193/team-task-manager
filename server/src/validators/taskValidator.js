const Joi = require('joi');

const taskSchema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
    due_date: Joi.date().allow(null).optional(),
    team_id: Joi.number().required(),
    assigned_to: Joi.number().allow(null).optional(),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().min(2).max(255).optional(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
    due_date: Joi.date().allow(null).optional(),
    assigned_to: Joi.number().allow(null).optional(),
});

module.exports = { taskSchema, updateTaskSchema };