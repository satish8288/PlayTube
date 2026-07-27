import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must not exceed 20 characters",
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores",
      "any.required": "Username is required",
      "string.empty": "Username cannot be empty",
    }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  fullName: Joi.string().trim().min(3).max(50).required().messages({
    "string.min": "Full name must be at least 3 characters long",
    "string.max": "Full name must not exceed 50 characters",
    "any.required": "Full name is required",
    "string.empty": "Full name cannot be empty",
  }),
  password: Joi.string().min(8).max(100).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
}).options({ stripUnknown: true });

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().lowercase().email(),
  username: Joi.string().trim().lowercase(),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
})
  .or("email", "username")
  .messages({
    "object.missing": "Either email or username is required",
  });

export const updateUserSchema = Joi.object({});
