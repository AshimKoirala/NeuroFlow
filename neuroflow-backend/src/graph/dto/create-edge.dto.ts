import {IsUUID, IsOptional, IsNumber} from 'class-validator'

export class CreateEdgeDto {

    @IsUUID()
    fromId: string;

    @IsUUID()
    toId:string;

    @IsOptional()
    @IsNumber()
    weight?:number;
    
}