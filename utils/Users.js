import Joi from 'joi'

export const registerJoi = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).required(),
    password: Joi.string().required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .message(
      "Password must be at least 8 characters long and contains at least one lowercase, one uppercase, and one number"
    )
})

export const loginJoi = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

