import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Movie } from './movie.entity';
import { Genre } from '../genres/genre.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  async findAll(page: number) {
    const take = 10;
    const skip = (page - 1) * take;
    return this.moviesRepository.find({ take, skip, relations: ['genres'] });
  }

  async findOne(id: number) {
    console.log(`findOne called with id: ${id}`);
    const movie = await this.moviesRepository.findOne({ where: { id }, relations: ['genres'] });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    try {
      const genreNames = createMovieDto.genres;
      const genres = await this.genresRepository.find({ where: { name: In(genreNames) } });

      if (genres.length !== genreNames.length) {
        throw new NotFoundException('One or more genres not found');
      }

      const movie = this.moviesRepository.create({ ...createMovieDto, genres });
      return this.moviesRepository.save(movie);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    try {
      const movie = await this.findOne(id);
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }

      const genreNames = updateMovieDto.genres;
      const genres = await this.genresRepository.find({ where: { name: In(genreNames) } });

      if (genres.length !== genreNames.length) {
        throw new NotFoundException('One or more genres not found');
      }

      movie.title = updateMovieDto.title ?? movie.title;
      movie.description = updateMovieDto.description ?? movie.description;
      movie.releaseDate = updateMovieDto.releaseDate ?? movie.releaseDate;
      movie.genres = genres;

      return this.moviesRepository.save(movie);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    const movie = await this.findOne(id);
    return this.moviesRepository.remove(movie);
  }

  async search(title: string) {
    const query = this.moviesRepository.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');
  
    
    query.where('movie.title LIKE :title', { title: `%${title}%` });
    
  
    const movies = await query.getMany();
    if (!movies.length) {
      throw new NotFoundException('No movies found');
    }
  
    return movies;
  }
  
}
