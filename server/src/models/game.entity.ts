import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GameType, EndingType, Turn } from '../shared/types';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int', { array: true })
  playerGameProfileIDs?: number[];

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ type: 'enum', enum: GameType })
  type?: GameType;

  @Column({ default: null, nullable: true })
  winnerGameProfileID?: number;

  @Column({ type: 'enum', enum: EndingType })
  typeOfWin?: EndingType;

  @Column('int', { array: true })
  finalState?: number[][];

  @Column('int', { array: true })
  turnHistory: Turn[];

  @Column({ nullable: true })
  startingPlayerGameProfileID?: number;

  @Column({ nullable: true })
  afterSwap1StartingPlayerGameProfileID?: number;

  @Column({ nullable: true })
  afterSwap2StartingPlayerGameProfileID?: number;
}
