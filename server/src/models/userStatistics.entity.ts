import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserStatisticsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
