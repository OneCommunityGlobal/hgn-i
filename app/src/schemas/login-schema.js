import Joi from "@hapi/joi";

const loginSchema = {
    email: Joi.string()
        .email()
        .required()
        .label("Email"),
    password: Joi.string()
        .required()
        .label("Password"),
};


export default loginSchema;
