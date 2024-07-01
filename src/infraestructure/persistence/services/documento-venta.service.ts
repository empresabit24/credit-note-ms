import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentosVentaModel } from '../models/documentosventa.model';

@Injectable()
export class DocumentoVentaService {
  constructor(
    @InjectModel(DocumentosVentaModel)
    private documentoVentaModel: typeof DocumentosVentaModel,
  ) {}

  async updateDocumentoVentaState(
    serie: string,
    numerodocumento: string,
  ): Promise<any> {
    try {
      const result = await this.documentoVentaModel.update(
        { idestado: 15 }, // Cambiar el estado a 'Anulado - Dado de baja (Nota de Crédito)'
        {
          where: {
            serie: serie,
            numerodocumento: numerodocumento,
          },
        },
      );

      if (result[0] === 0) {
        return { message: 'Documento de venta no encontrado o sin cambios.' };
      }
    } catch (error) {
      throw new Error(
        `Error al actualizar el estado del documento de venta: ${error.message}`,
      );
    }
  }
}
