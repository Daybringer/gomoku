import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  quickSearchQueue: string[] = [];

  printQueue(): void {
    console.log(this.quickSearchQueue);
  }

  joinQuickQueue(socketID: string) {
    this.printQueue();
    this.quickSearchQueue.push(socketID);
  }

  leaveQuickQueue(socketID: string) {
    if (this.quickSearchQueue.includes(socketID)) {
      const indexOfSocket = this.quickSearchQueue.indexOf(socketID);
      this.quickSearchQueue.splice(indexOfSocket, 1);
    }
  }

  tryMatchPlayersQuickQue(): [string, string] | null {
    if (this.quickSearchQueue.length >= 2) {
      return this.quickSearchQueue.splice(0, 2) as [string, string];
    } else {
      return null;
    }
  }
}
