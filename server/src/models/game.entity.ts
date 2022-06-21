import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { PlayerGameProfile } from './playerGameProfile.entity';

import { GameType, TypeOfWin, Turn } from '../shared/types';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(
    () => PlayerGameProfile,
    (playerGameProfile) => playerGameProfile.game,
  )
  playerProfiles?: PlayerGameProfile[];

  @CreateDateColumn()
  createdAt?: Date[];

  @Column({ type: 'enum', enum: GameType })
  type?: GameType;

  @Column({ default: 0 })
  eloDelta?: number;

  @Column({ default: null, nullable: true })
  winnerID?: number;

  @Column({ type: 'enum', enum: TypeOfWin })
  typeOfWin?: TypeOfWin;

  @Column('int', { array: true })
  finalState?: number[][];

  @Column('int', { array: true })
  turnHistory: Turn[];

  @Column()
  startingPlayerUUID: string;

  @Column()
  afterSwapStartingPlayerUUID: string;
}
