import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
} from 'typeorm';

import { GameEntity as Game } from '../../game/models/game.entity';

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
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  UUID: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: '' })
  googleID: string;

  @Column({ default: '' })
  password?: string;

  // @Column({default:false})
  // admin?:false;

  // @Column({ default: 1000 })
  // elo?: number;

  // @ManyToMany(() => Game)
  // @JoinTable()
  // games?: Game[];

  // @Column({ default: 0 })
  // credit?: number;

  // @Column({ type: 'enum', enum: GameBoard, default: GameBoard.NORMAL })
  // gameBoard?: GameBoard;

  // @Column()
  // colors?: colors;

  // @Column()
  // selectedIcon?: Icon;

  // @Column()
  // availableIcons?: Icon[];

  // @Column()
  // selectedSocialBladeSkin?: SocialBladeSkin;

  // @Column()
  // availableSocialBladeSkins?: SocialBladeSkin[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
