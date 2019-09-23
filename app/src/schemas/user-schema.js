import Joi from "@hapi/joi";
import projectSchema from "../schemas/project-schema";
import teamSchema from "../schemas/team-schema";

const userLinkSchema = {
  Name: Joi.string()
    .trim()
    .required(),
  Link: Joi.string()
    .trim()
    .uri()
    .required()
};

const violationSchema = {
  _id: Joi.string()
    .allow("")
    .optional(),
  date: Joi.string()
    .required()
    .label("Violation Date"),
  description: Joi.string()
    .trim()
    .required()
    .label("Violation Description")
};

const userSchema = {
    _id: Joi.string()
      .allow("")
      .optional(),
    profilePic: Joi.string().label("Profile Picture"),
    firstName: Joi.string()
      .trim()
      .required()
      .min(2)
      .label("First Name"),
    lastName: Joi.string()
      .trim()
      .required()
      .min(2)
      .label("Last Name"),
    isActive: Joi.boolean()
      .default(true)
      .label("Active Status"),
    role: Joi.any()
      .allow(["Administrator", "Core Team", "Manager", "Volunteer"])
      .default("Volunteer")
      .label("Role"),
    email: Joi.string()
      .trim()
      .email()
      .required()
      .label("Email"),
    weeklyComittedHours: Joi.number()
      .required()
      .min(0)
      .default(5)
      .label("Weekly Committed Hours"),
    violations: Joi.array()
      .items(violationSchema)
      .min(0)
      .max(5),
    bio: Joi.string()
      .allow("")
      .optional(),
    adminLinks: Joi.array()
      .items(userLinkSchema)
      .min(0)
      .label("Administrative Links"),
    personalLinks: Joi.array()
      .items(userLinkSchema)
      .min(0)
      .label("Personal Links"),
    teams: Joi.array()
      .items(teamSchema)
      .min(0),
    projects: Joi.array()
      .items(projectSchema)
      .min(0),
    phoneNumber: Joi.any().optional(),
    badges: Joi.array().min(0),
    badgeCollection: Joi.any().optional()
  };

export default userSchema;
