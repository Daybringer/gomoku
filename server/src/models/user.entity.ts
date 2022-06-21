import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { GameEntity as Game } from './game.entity';
import { PlayerGameProfile } from './playerGameProfile.entity';

import { UserConfigEntity as UserConfig } from './userConfig.entity';

import { LoginStrategy } from '../shared/types';

@Entity()
export class UserEntity {
  // Credentials
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column({ nullable: true })
  // gID?: string;

  // @Column({ nullable: true })
  // fID?: string;

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

  // TODO problem with postgres (TypeORMs) createdAt
  // @Column()
  // createdTimestamp: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ default: false })
  admin?: boolean;

  @Column({ type: 'enum', enum: LoginStrategy })
  strategy: LoginStrategy;

  @Column({ default: false })
  verified?: boolean;

  @Column({ default: 1000 })
  elo?: number;

  @OneToMany(
    () => PlayerGameProfile,
    (playerGameProfile) => playerGameProfile.user,
  )
  gameProfiles?: PlayerGameProfile[];

  @ManyToMany(() => Game)
  @JoinTable()
  games?: Game[];

  @Column({ default: 0 })
  credit?: number;

  @Column({ default: 0 })
  nameChangeTokens?: number;

  @OneToOne(() => UserConfig)
  @JoinColumn()
  userConfig: UserConfig;
}
