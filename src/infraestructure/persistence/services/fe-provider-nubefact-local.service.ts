import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FeProviderNubefactLocal } from '../models/provider-nubefact-local.model';

@Injectable()
export class FeProviderNubefactLocalService {
  constructor(
    @InjectModel(FeProviderNubefactLocal)
    private feProviderNubefactLocalModel: typeof FeProviderNubefactLocal,
  ) {}

  async findByLocal(idlocal: string): Promise<FeProviderNubefactLocal> {
    return this.feProviderNubefactLocalModel.findOne({ where: { idlocal } });
  }
}
