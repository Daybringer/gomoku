import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GameType, EndingType, Turn, Opening } from '../shared/types';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: GameType })
  type: GameType;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: EndingType })
  typeOfWin: EndingType;

  @Column('int', { array: true })
  finalState: number[][];

  @Column('int', { array: true })
  turnHistory: Turn[];

  @Column('int', { array: true })
  playerGameProfileIDs: number[];

  @Column({ default: null, nullable: true })
  winnerGameProfileID?: number;

  @Column('int', { default: null, nullable: true, array: true })
  winningCombination?: Turn[];

  @Column({ nullable: true })
  startingPlayerGameProfileID: number;

  @Column({ nullable: true })
  afterSwap1StartingPlayerGameProfileID?: number;

  @Column({ nullable: true })
  afterSwap2StartingPlayerGameProfileID?: number;

  // Settings
  @Column()
  openingType: Opening;

  @Column()
  timeLimitInSeconds: number;

  @Column()
  hasTimeLimit: boolean;

  @Column()
  doesOverlineCount: boolean;

  @Column()
  boardSize: number;

  @Column()
  winningLineSize: number;
}
