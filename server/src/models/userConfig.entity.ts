import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Colors, GameBoard } from '../shared/types';

@Entity()
export class UserConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  colors?: Colors;

  @Column({ type: 'enum', enum: GameBoard, default: GameBoard.Normal })
  gameBoard?: GameBoard;

  @Column('int')
  selectedIconID?: number;

  @Column('int', { array: true })
  availableIconIDs?: number[];

  @Column('int')
  selectedSocialBladeSkinID?: number;

  @Column('int', { array: true })
  availableSocialBladeSkinIDs?: number[];
}
