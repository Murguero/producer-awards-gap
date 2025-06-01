import Joi from 'joi';

const excelMovieValidationSchema = Joi.object({
  year: Joi.number().integer().min(1800).max(2100).required(),
  title: Joi.string().trim().required(),
  studios: Joi.string().trim().required(),
  producers: Joi.string().trim().required(),
  winner: Joi.string().valid('yes', '').optional(),
});

export default excelMovieValidationSchema;
