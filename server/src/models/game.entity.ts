import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  ColumnTypeUndefinedError,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { PlayerGameProfile } from './playerGameProfile.entity';

import { UserEntity as User } from './user.entity';

enum gameType {
  RANKED = 'ranked',
  QUICK = 'quick',
  CUSTOM = 'custom',
}

enum typeOfWin {
  COMBINATION = 'combination',
  TIME = 'time',
  SURRENDER = 'surrender',
  TIE = 'tie',
}

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(
    () => PlayerGameProfile,
    (playerGameProfile) => playerGameProfile.game,
  )
  playerProfiles: PlayerGameProfile[];

  @CreateDateColumn()
  date?: Date[];

  @Column({ type: 'enum', enum: gameType })
  type?: gameType;

  @Column({ default: 0 })
  eloDelta?: number;

  @Column({ default: null, nullable: true })
  winnerUUID?: string;

  @Column({ type: 'enum', enum: typeOfWin })
  typeOfWin?: typeOfWin;

  @Column('int', { array: true })
  finalState?: number[][];

  @Column('int', { array: true })
  turnHistory: number[][];

  @Column()
  startingPlayerUUID: string;

  @Column()
  afterSwapStartingPlayerUUID: string;
}
