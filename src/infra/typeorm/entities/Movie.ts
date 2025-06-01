import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  year!: number;

  @Column()
  title!: string;

  @Column()
  studios!: string;

  @Column()
  producers!: string;

  @Column()
  winner!: boolean;
}
