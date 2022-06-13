import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { IconEntity as Icon } from './icon.entity';
import { SocialBladeSkinEntity as SocialBladeSkin } from './socialBladeSkin.entity';
export interface colors {
  enemeyColor: string;
  playerColor: string;
}
enum GameBoard {
  NORMAL = 'normal',
  TRADITIONAL = 'traditional',
  MODERN = 'modern',
}
@Entity()
export class UserConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  colors?: colors;

  @Column({ type: 'enum', enum: GameBoard, default: GameBoard.NORMAL })
  gameBoard?: GameBoard;

  @Column('int')
  selectedIconID?: number;

  @Column('int', { array: true })
  availableIcons?: number[];

  @Column('int')
  selectedSocialBladeSkin?: number;

  @Column('int', { array: true })
  availableSocialBladeSkins?: number[];
}
