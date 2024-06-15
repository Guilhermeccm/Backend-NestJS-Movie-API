import { IsString, IsNotEmpty, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;
 
  
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  releaseDate: string;

  @IsArray()
  @Type(() => String)
  @IsNotEmpty({ each: true })
  genres: string[];
}
