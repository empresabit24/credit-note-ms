/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ProductLocalService } from '../../../infraestructure/persistence/services/product-local.service';
import { StockProductLocalService } from '../../../infraestructure/persistence/services/stock-product-local.service';
import { StoreService } from '../../../infraestructure/persistence/services/store.service';
require('dotenv').config({ path: '.env.local' });

@Injectable()
export class ResetStockItemsCreditNoteUseCase {
  private logger = new Logger(ResetStockItemsCreditNoteUseCase.name);

  constructor(
    private readonly productLocalService: ProductLocalService,
    private readonly stockProductLocalService: StockProductLocalService,
    private readonly storeService: StoreService,
  ) {}
  async execute(idLocal: number, idProducto: number, quantity: number) {
    try {
      const productLocal = await this.productLocalService.findByLocalAndProduct(
        idLocal,
        idProducto,
      );

      const store = await this.storeService.findByLocal(productLocal.idlocal);

      const actualStock =
        await this.stockProductLocalService.findByProductLocalAndStore(
          productLocal.idproductolocal,
          store.idtienda,
        );

      const updatedStock =
        await this.stockProductLocalService.updateByProductLocalAndStore(
          productLocal.idproductolocal,
          store.idtienda,
          Number(actualStock.stock) + Number(quantity),
        );

      this.logger.log('Creó con éxito la nota de crédito');
      return {
        success: true,
        message: 'Save a new credit note successfully!',
        response: updatedStock,
        httpStatus: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Sucedió un error');
      return {
        success: false,
        message: error?.message || 'Error to create a new credit note!',
        code: error.response?.data?.codigo || error.code,
        response: error.response?.data?.errors || error,
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
