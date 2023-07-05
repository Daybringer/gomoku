import { Opening } from 'src/shared/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameSettingsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  openingType: Opening;

  @Column()
  hasTimeLimit: boolean;

  @Column()
  timeLimitInSeconds?: number;

  @Column()
  doesOverlineCount: boolean;

  @Column()
  boardSize: number;

  @Column()
  winningLineSize: number;
}
