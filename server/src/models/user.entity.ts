import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { LoginStrategy } from '../shared/types';
import { Achievement } from '../shared/achievements';
import { UserStatisticsEntity } from './userStatistics.entity';
import { UserSettingsEntity } from './userSettings.entity';
import { PlayerGameProfileEntity } from './playerGameProfile.entity';

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

  @Column({ nullable: true, default: null })
  password?: string;

  @Column({ nullable: true, default: null })
  mailVerificationCode?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  admin: boolean;

  @Column({ default: false })
  premium: boolean;

  @Column({ type: 'enum', enum: LoginStrategy })
  strategy: LoginStrategy;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: 1000 })
  elo: number;

  @Column({ default: 0 })
  credit: number;

  @Column({ default: 0 })
  nameChangeTokens: number;

  @Column({ type: 'enum', array: true, enum: Achievement, default: [] })
  achievements: Achievement[];

  @OneToOne(() => UserStatisticsEntity, (statistics) => statistics.user)
  @JoinColumn()
  statistics: UserStatisticsEntity;

  @OneToOne(() => UserSettingsEntity, (settings) => settings.user)
  @JoinColumn()
  settings: UserSettingsEntity;

  @OneToMany(
    () => PlayerGameProfileEntity,
    (playerGameProfile) => playerGameProfile.user,
  )
  playerGameProfiles: PlayerGameProfileEntity[];
}
