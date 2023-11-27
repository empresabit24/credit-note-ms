import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from '../models/store.model';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store)
    private storeModel: typeof Store,
  ) {}

  async findByLocal(idLocal: number): Promise<Store> {
    return this.storeModel.findOne({
      where: { idlocal: idLocal },
    });
  }
}
