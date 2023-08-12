import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator';

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
}