import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Parameter } from '../models/parameter.model';

@Injectable()
export class ParameterService {
  constructor(
    @InjectModel(Parameter)
    private parameterModel: typeof Parameter,
  ) {}

  async findByName(name: string): Promise<Parameter> {
    return this.parameterModel.findOne({ where: { nombre: name } });
  }
}
