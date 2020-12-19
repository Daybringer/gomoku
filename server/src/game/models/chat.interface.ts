import { UserInterface as User } from '../../users/models/user.interface';
interface message {
  author: string;
  content: string;
}

export interface ChatRecord {
  id?: number;
  messages?: message[];
}
