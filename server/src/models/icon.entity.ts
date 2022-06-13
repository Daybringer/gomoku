import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CosmeticEntity } from './cosmetic.entity';

@Entity()
export class IconEntity extends CosmeticEntity {}
