import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { Movie } from './movies/movie.entity';
import { Genre } from './genres/genre.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'movie_db.sqlite',
      entities: [Movie, Genre],
      synchronize: true,
    }),
    MoviesModule,
    GenresModule,
  ],
})
export class AppModule {}
