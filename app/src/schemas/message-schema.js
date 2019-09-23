import Joi from "@hapi/joi";

const teamSchema = {
  _id: Joi.string().allow(""),
  subject: Joi.string().required(),
  message: Joi.string().required(),
  senderId: Joi.string().allow(""),
  receiverId: Joi.string().allow(""),
  eventType: Joi.string().allow(""),
  isRead: Joi.boolean().required(),
};

export default teamSchema;
