import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GameType, TypeOfWin, Turn } from '../shared/types';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int', { array: true })
  playerGameProfileIDs?: number[];

  @CreateDateColumn()
  createdAt?: Date[];

  @Column({ type: 'enum', enum: GameType })
  type?: GameType;

  @Column()
  startingTime: number;

  @Column({ default: null, nullable: true })
  winnerGameProfileID?: number;

  @Column({ type: 'enum', enum: TypeOfWin })
  typeOfWin?: TypeOfWin;

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
