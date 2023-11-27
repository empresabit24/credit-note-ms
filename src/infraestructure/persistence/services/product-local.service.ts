import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductLocal } from '../models/product-local.model';

@Injectable()
export class ProductLocalService {
  constructor(
    @InjectModel(ProductLocal)
    private productLocalModel: typeof ProductLocal,
  ) {}

  async findByLocalAndProduct(
    idlocal: number,
    idproducto: number,
  ): Promise<ProductLocal> {
    return this.productLocalModel.findOne({ where: { idlocal, idproducto } });
  }
}
