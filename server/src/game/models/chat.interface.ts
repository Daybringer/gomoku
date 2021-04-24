interface message {
  author: string;
  content: string;
}

export interface ChatRecord {
  id?: number;
  messages?: message[];
}
