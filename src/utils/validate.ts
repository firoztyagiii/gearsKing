import { celebrate, Joi, errors, Segments } from "celebrate";

export const validateReview = () => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      review: Joi.string().required(),
      ratings: Joi.number().required(),
    }),
  });
};
