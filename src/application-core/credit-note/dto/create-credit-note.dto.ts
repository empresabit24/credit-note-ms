import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsObject,
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
  unitPrice: number;
}

class ClientDTO {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  documentType: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  denomination: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;
}

class DocumentToChangeDTO {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  typeId: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  series: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  correlative: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  exchangeRate: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  currency: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  dateOfIssue: string;
}

export class CreateCreditNoteDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  idLocal: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  creditNoteType: number;

  @ApiProperty({ required: true })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DocumentToChangeDTO)
  documentToChange: DocumentToChangeDTO;

  @ApiProperty({ required: true })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClientDTO)
  client: ClientDTO;

  @ApiProperty({ required: true })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items: ItemDTO[];
}
