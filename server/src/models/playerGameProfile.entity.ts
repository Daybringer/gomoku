import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameEntity } from './game.entity';
import { UserEntity } from './user.entity';

@Entity()
export class PlayerGameProfile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.gameProfiles)
  user: UserEntity;

  @Column()
  timeLeft: number;

  @ManyToOne(() => GameEntity, (gameEntity) => gameEntity.playerProfiles)
  game: GameEntity;
}
