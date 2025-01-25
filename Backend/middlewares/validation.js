import Joi from "joi";

export const validateChatRequest = (req, res, next) => {
  const schema = Joi.object({
    message: Joi.string().required(), // Validate `message` field as a required string
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next(); // If validation passes, proceed to the next middleware
};
