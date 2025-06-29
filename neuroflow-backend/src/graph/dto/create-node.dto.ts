import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNodeDto{
    @IsNotEmpty()
    @IsString()
    label: string;

    @IsString()
    description?: string;
}