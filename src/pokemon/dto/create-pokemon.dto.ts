
import { IsPositive, Min, MinLength,IsInt, IsString } from "class-validator"

export class CreatePokemonDto {

    @IsString()
    @MinLength(1)
    name: string
    
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number
}
