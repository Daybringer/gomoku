import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { GameEntity } from './game.entity';

@Entity()
export class PlayerGameProfileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  timeLeft: number;

  @Column({ nullable: true })
  eloDelta?: number;

  @Column({ nullable: true })
  postGameElo?: number;

  @Column()
  isWinner: boolean;

  @ManyToOne(() => GameEntity, (game) => game.playerGameProfiles)
  game: GameEntity;

  @ManyToOne(() => UserEntity, (user) => user.playerGameProfiles)
  user?: UserEntity;
}
