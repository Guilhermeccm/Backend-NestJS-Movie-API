// movie.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Genre } from '../genres/genre.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  releaseDate: string;

  @ManyToMany(() => Genre, genre => genre.movies)
  @JoinTable()
  genres: Genre[];
}

