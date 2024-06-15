import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  findAll() {
    return this.genresRepository.find();
  }

  create(createGenreDto: CreateGenreDto) {
    const genre = this.genresRepository.create(createGenreDto);
    return this.genresRepository.save(genre);
  }

  async remove(id: number) {
    const genre = await this.genresRepository.findOne({ where: { id } });
    return this.genresRepository.remove(genre);
  }
}
