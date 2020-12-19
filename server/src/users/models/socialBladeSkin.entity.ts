import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocialBladeSkinEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  purchasable: boolean;

  @Column()
  priceInCredits: number;

  @Column()
  priceInEuro: number;
}
