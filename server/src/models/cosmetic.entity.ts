import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CosmeticEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  path: string;

  @Column()
  purchasable: boolean;

  @Column()
  priceInCredits: number;
}
