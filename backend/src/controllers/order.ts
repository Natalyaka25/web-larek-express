import type { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import ProductModel from '../models/product.model';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';

export enum PaymentType {
  Card = 'card',
  Online = 'online',
}

export interface IOrderRequest {
  payment: PaymentType;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const validateProductsForOrder = (
  products: Array<{ price: number | null }>,
  itemsCount: number,
  total: number,
): string | null => {
  if (products.length !== itemsCount) {
    return 'Некоторые товары не найдены';
  }

  if (products.some((product) => product.price === null)) {
    return 'Некоторые товары недоступны для продажи';
  }

  const calculatedTotal = products.reduce((sum, product) => sum + (product.price ?? 0), 0);
  if (calculatedTotal !== total) {
    return 'Сумма total не совпадает со стоимостью товаров';
  }

  return null;
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total } = req.body as IOrderRequest;

    const products = await ProductModel.find({ _id: { $in: items } })
      .select('_id price')
      .lean();
    const productsValidationError = validateProductsForOrder(products, items.length, total);
    if (productsValidationError) {
      next(new BadRequestError(productsValidationError));
      return;
    }

    res.status(200).json({
      id: faker.string.uuid(),
      total,
    });
  } catch (_error) {
    next(new InternalServerError('Не удалось создать заказ'));
  }
};
