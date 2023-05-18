import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';

import { GameBoard } from '../shared/types';

import { LoginStrategy } from '../shared/types';
import { ProfileIcon } from '../shared/icons';
import { Achievement } from '../shared/achievements';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @PrimaryColumn({ unique: true })
  username: string;

  @Column({ nullable: true, default: null })
  socialID?: string;

  @PrimaryColumn({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  mailVerificationCode?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ default: false })
  admin?: boolean;

  @Column({ default: false })
  premium?: boolean;

  @Column({ type: 'enum', enum: LoginStrategy })
  strategy: LoginStrategy;

  @Column({ default: false })
  verified?: boolean;

  @Column({ default: 1000 })
  elo?: number;

  @Column({ default: 0 })
  credit: number;

  @Column({ default: 0 })
  nameChangeTokens?: number;

  @Column({ type: 'enum', array: true, enum: Achievement, default: [] })
  achievements: Achievement[];

  @Column({ default: '#00b3fe' })
  playerColor: string;

  @Column({ default: '#ff2079' })
  enemyColor: string;

  @Column({ type: 'enum', enum: GameBoard, default: GameBoard.Standard })
  gameBoard: GameBoard;

  @Column({ type: 'enum', enum: ProfileIcon, default: ProfileIcon.defaultBoy })
  selectedIcon: ProfileIcon;

  @Column({
    type: 'enum',
    array: true,
    enum: ProfileIcon,
    default: [ProfileIcon.defaultBoy],
  })
  availableIcons: ProfileIcon[];

  @Column({ default: 0 })
  rankedWon: number;

  @Column({ default: 0 })
  rankedLost: number;

  @Column({ default: 0 })
  rankedTied: number;

  @Column({ default: 0 })
  quickWon: number;

  @Column({ default: 0 })
  quickLost: number;

  @Column({ default: 0 })
  quickTied: number;
}
