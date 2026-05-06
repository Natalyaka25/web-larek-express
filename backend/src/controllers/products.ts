import type { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import ProductModel from '../models/product.model';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel.find({}).sort({ title: 1 });
    res.json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    next(new InternalServerError());
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, description, price, category, image,
    } = req.body;
    const product = await ProductModel.create({
      title, description, price, category, image,
    });
    res.json(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных при создании товара'));
      return;
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      next(new ConflictError('Товар с таким title уже существует'));
      return;
    }
    next(new InternalServerError());
  }
};
