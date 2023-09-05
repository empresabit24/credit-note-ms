import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  unitCost: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  igv: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  subtotal: number;
}

export class CreateCreditNoteDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  series: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  correlative: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observations?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  idlocal: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  documentTypeClient: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  documentNumberClient: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  denominationClient: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  creditNoteType: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  documentCorrelativeToChange: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  documentSeriesToChange: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  documentTypeToChange: number;

  @ApiProperty({ required: true })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items: ItemDTO[];
}
