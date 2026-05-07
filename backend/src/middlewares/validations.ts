import { Joi, Segments, celebrate } from 'celebrate';
import { PaymentType } from '../controllers/order';

export const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0).allow(null),
  }),
});

export const validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid(PaymentType.Card, PaymentType.Online).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().min(0).required(),
    items: Joi.array().items(Joi.string().required()).min(1).required(),
  }),
});
