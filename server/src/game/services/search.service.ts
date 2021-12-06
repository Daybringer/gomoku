import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  quickSearchQueue: number[] = [];

  joinQuickQueue(socketID: number) {
    this.quickSearchQueue.push(socketID);
  }

  leaveQuickQueue(socketID: number) {
    if (this.quickSearchQueue.includes(socketID)) {
      const indexOfSocket = this.quickSearchQueue.indexOf(socketID);
      this.quickSearchQueue.splice(indexOfSocket, 1);
    }
  }

  tryMatchPlayersQuickQue(): [number, number] | null {
    if (this.quickSearchQueue.length >= 2) {
      return this.quickSearchQueue.splice(0, 2) as [number, number];
    } else {
      return null;
    }
  }
}
