import Joi from "@hapi/joi";

const projectSchema = {
  _id: Joi.string().allow(""),
  name: Joi.string().required(),
  isActive: Joi.boolean().required(),
  managerId: Joi.string().allow(""),
};

export default projectSchema;
