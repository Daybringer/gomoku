import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class NamelessGUserEntity {
  @PrimaryColumn({ unique: true })
  email: string;

  @Column()
  googleID: string;
}
