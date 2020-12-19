import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  BeforeInsert,
} from 'typeorm';

import { UserEntity as User } from '../../users/models/user.entity';

enum gameType {
  RANKED = 'ranked',
  QUICK = 'quick',
  CUSTOM = 'custom',
  NUMBER = 1,
}

enum typeOfWin {
  COMBINATION = 'combination',
  TIME = 'time',
  SURRENDER = 'surrender',
  TIE = 'tie',
}

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @Column()
  playersUUID: User[];

  @CreateDateColumn()
  date?: Date[];

  @Column({ type: 'enum', enum: gameType })
  type?: gameType;

  @Column({ default: 0 })
  eloDifference?: number;

  @Column()
  time?: number;

  @Column({ default: 'tie' })
  winnerUUID?: string;

  @Column({ type: 'enum', enum: typeOfWin })
  typeOfWin?: typeOfWin;

  @Column()
  finalState?: number[][];
}
