import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUUID: string;

  @Column()
  isRevoked: boolean;

  @Column()
  expires: Date;
}
