import { GameBoard } from 'src/shared/types';
import { ProfileIcon } from 'src/shared/icons';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserSettingsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => UserEntity, (user) => user.settings)
  user: UserEntity;

  @Column({ default: '#00b3fe' })
  playerColor: string;

  @Column({ default: '#ff2079' })
  opponentColor: string;

  @Column({ type: 'enum', enum: GameBoard, default: GameBoard.Standard })
  gameBoard: GameBoard;

  @Column({ type: 'enum', enum: ProfileIcon, default: ProfileIcon.defaultBoy })
  selectedIcon: ProfileIcon;

  @Column({
    type: 'enum',
    array: true,
    enum: ProfileIcon,
    default: [ProfileIcon.defaultBoy],
  })
  availableIcons: ProfileIcon[];
}
