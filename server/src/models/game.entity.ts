import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GameType, EndingType, Turn } from '../shared/types';
import { PlayerGameProfileEntity } from './playerGameProfile.entity';
import { GameSettingsEntity } from './gameSettings.entity';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: GameType })
  type: GameType;

  @Column({ type: 'enum', enum: EndingType })
  typeOfWin: EndingType;

  @Column('int', { array: true })
  turnHistory: Turn[];

  @Column('int', { default: null, nullable: true, array: true })
  winningCombination?: Turn[];

  @OneToMany(
    () => PlayerGameProfileEntity,
    (playerGameProfile) => playerGameProfile.game,
  )
  playerGameProfiles: PlayerGameProfileEntity[];

  @OneToOne(() => PlayerGameProfileEntity)
  @JoinColumn()
  winner?: PlayerGameProfileEntity;

  @OneToOne(() => PlayerGameProfileEntity)
  @JoinColumn()
  startingPlayer: PlayerGameProfileEntity;

  @OneToOne(() => PlayerGameProfileEntity)
  @JoinColumn()
  afterSwapStartingPlayer?: PlayerGameProfileEntity;

  @OneToOne(() => GameSettingsEntity)
  @JoinColumn()
  gameSettings: GameSettingsEntity;
}
