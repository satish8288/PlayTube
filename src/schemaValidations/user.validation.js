import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(20)
    .pattern(/^[a-z0-9_]+$/)
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
  password: Joi.string().min(8).max(100).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 100 characters",
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
}).options({ stripUnknown: true });

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email cannot be empty",
  }),
  username: Joi.string().trim().lowercase().min(3).max(20).pattern(/^[a-z0-9_]+$/).messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must not exceed 20 characters",
    "string.empty": "Username cannot be empty",
    "string.pattern.base": "Username can only contain letters, numbers, and underscores",
  }),
  password: Joi.string().min(8).max(100).required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/).messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 100 characters",
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
})
  .or("email", "username")
  .messages({
    "object.missing": "Either email or username is required",
  });

export const changeCurrentPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(100).required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/).messages({
    "string.min": "Old password must be at least 8 characters long",
    "string.max": "Old password must not exceed 100 characters",
    "any.required": "Old password is required",
    "string.empty": "Old password cannot be empty",
  }),
  newPassword: Joi.string().min(8).max(100).required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/).messages({
    "string.min": "New password must be at least 8 characters long",
    "string.max": "New password must not exceed 100 characters",
    "any.required": "New password is required",
    "string.empty": "New password cannot be empty",
  }),
}).options({ stripUnknown: true });


export const updateAccountDetailsSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email cannot be empty",
  }),
  fullName: Joi.string().trim().min(3).max(50).messages({
    "string.min": "Full name must be at least 3 characters long",
    "string.max": "Full name must not exceed 50 characters",
    "string.empty": "Full name cannot be empty",
  })
}).min(1)
  .messages({
    "object.min": "At least one field (fullName or email) is required to update",
  })
  .options({ stripUnknown: true });

