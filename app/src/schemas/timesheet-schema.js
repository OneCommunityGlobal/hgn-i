import Joi from "@hapi/joi";

const teamSchema = {
  _id: Joi.string().allow(""),
};

export default teamSchema;
