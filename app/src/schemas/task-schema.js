import Joi from "@hapi/joi";

const taskSchema = {
  _id: Joi.string().allow(""),
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  assignedToId: Joi.string().allow(""),
  isActive: Joi.boolean().required(),
  isComplete: Joi.boolean().required(),
};

export default taskSchema;
