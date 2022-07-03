import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PlayerGameProfile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ default: null, nullable: true })
  userID?: number;

  @Column()
  timeLeft: number;

  @Column({ nullable: true })
  eloDelta?: number;
}
