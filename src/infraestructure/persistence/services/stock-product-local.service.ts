import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StockProductLocal } from '../models/stock-product-local.model';

@Injectable()
export class StockProductLocalService {
  constructor(
    @InjectModel(StockProductLocal)
    private stockProductLocalModel: typeof StockProductLocal,
  ) {}

  async findByProductLocalAndStore(
    idProductLocal: number,
    idStore: number,
  ): Promise<StockProductLocal> {
    return this.stockProductLocalModel.findOne({
      where: { idproductolocal: idProductLocal, idtienda: idStore },
    });
  }

  async updateByProductLocalAndStore(
    idProductLocal: number,
    idStore: number,
    stock: number,
  ): Promise<any> {
    return this.stockProductLocalModel.update(
      {
        stock,
        stock_presentacion: stock,
        stock_unidades: stock,
      },
      { where: { idproductolocal: idProductLocal, idtienda: idStore } },
    );
  }
}
