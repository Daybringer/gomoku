import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { UserConfigEntity as UserConfig } from './userConfig.entity';

import { LoginStrategy } from '../shared/types';

@Entity()
export class UserEntity {
  // Credentials
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

  @Column({ type: 'enum', enum: LoginStrategy })
  strategy: LoginStrategy;

  @Column({ default: false })
  verified?: boolean;

  @Column({ default: 1000 })
  elo?: number;

  @Column({ default: 0 })
  credit?: number;

  @Column({ default: 0 })
  nameChangeTokens?: number;

  @OneToOne(() => UserConfig)
  @JoinColumn()
  userConfig: UserConfig;
}
