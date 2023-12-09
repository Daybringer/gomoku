import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
export interface RankedQueueMember {
  socketID: string;
  userID: number;
  elo: number;
  searchIntervalID: ReturnType<typeof setTimeout> | null;
  // in ms
  numberOfSearchAttempts: number;
}
export interface QuickQueueMember {
  socketID: string;
  userID?: number;
}
@Injectable()
export class SearchService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  quickSearchQueue: QuickQueueMember[] = [];
  rankedSearchQueue: RankedQueueMember[] = [];

  //Ranked queue
  async verifyJwt(socketID: string, token: string): Promise<RankedQueueMember> {
    const payload = this.jwtService.verify(token);
    const userID = payload.sub;
    const user = await this.usersService.findOneByID(userID);
    if (!user) throw 'User not found';
    return {
      elo: user.elo,
      socketID,
      userID: user.id,
      numberOfSearchAttempts: 1,
      searchIntervalID: null,
    };
  }

  private removeSocketFromQueue(
    socketID: string,
    queue: QuickQueueMember[] | RankedQueueMember[],
    isRanked?: boolean,
  ) {
    const indexOfSocket = queue.findIndex(
      (member) => member.socketID === socketID,
    );
    if (indexOfSocket != -1) {
      if (isRanked) {
        clearInterval(
          (queue[indexOfSocket] as RankedQueueMember).searchIntervalID,
        );
      }
      queue.splice(indexOfSocket, 1);
    }
  }

  joinRankedQueue(member: RankedQueueMember) {
    this.rankedSearchQueue.push(member);
  }

  leaveRankedQueue(socketID: string) {
    this.removeSocketFromQueue(socketID, this.rankedSearchQueue, true);
  }

  tryToMatchPlayersRankedQueue(
    member: RankedQueueMember,
    eloToleranceBase: number,
  ): [RankedQueueMember, RankedQueueMember] | null {
    console.log('Tolerance:', eloToleranceBase * member.numberOfSearchAttempts);
    const foundOpponent = this.rankedSearchQueue.find(
      (opponent) =>
        member.socketID !== opponent.socketID &&
        opponent.userID !== member.userID &&
        Math.abs(opponent.elo - member.elo) <=
          eloToleranceBase * member.numberOfSearchAttempts,
    );
    if (foundOpponent) {
      this.removeSocketFromQueue(member.socketID, this.rankedSearchQueue, true);
      this.removeSocketFromQueue(
        foundOpponent.socketID,
        this.rankedSearchQueue,
        true,
      );
      return [member, foundOpponent];
    } else {
      return null;
    }
  }

  //Quick queue
  joinQuickQueue(socketID: string, userID?: number) {
    this.quickSearchQueue.push({ socketID, userID });
  }

  leaveQuickQueue(socketID: string) {
    this.printQueues();
    this.removeSocketFromQueue(socketID, this.quickSearchQueue);
    this.printQueues();
  }

  /**
   *
   * @param  ?userID
   * @returns pair of matched players socket IDs or null
   */
  tryToMatchPlayersQuickQueue(
    socketID: string,
    userID = -1,
  ): [string, string] | null {
    const foundOpponent = this.quickSearchQueue.find(
      (member) =>
        socketID !== member.socketID &&
        (!member.userID || userID !== member.userID),
    );
    if (foundOpponent) {
      this.removeSocketFromQueue(socketID, this.quickSearchQueue);
      this.removeSocketFromQueue(foundOpponent.socketID, this.quickSearchQueue);
      return [socketID, foundOpponent.socketID];
    } else {
      return null;
    }
  }

  printQueues() {
    console.debug('QUICK:', this.quickSearchQueue);
    console.debug('RANKED', this.rankedSearchQueue);
  }
}
