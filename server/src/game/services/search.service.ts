import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
interface RankedQueueMember {
  socketID: string;
  userID: number;
  elo: number;
  // in ms
  noOfSearchTries: number;
}
interface QuickQueueMember {
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
    return { elo: user.elo, socketID, userID: user.id, noOfSearchTries: 0 };
  }

  private removeSocketFromQueue(
    socketID: string,
    queue: QuickQueueMember[] | RankedQueueMember[],
  ) {
    const indexOfSocket = queue.findIndex(
      (member) => member.socketID === socketID,
    );
    if (indexOfSocket) {
      this.quickSearchQueue.splice(indexOfSocket, 1);
    }
  }

  joinRankedQueue(member: RankedQueueMember) {
    this.rankedSearchQueue.push(member);
  }

  leaveRankedQueue(socketID: string) {
    this.removeSocketFromQueue(socketID, this.rankedSearchQueue);
  }

  tryMatchPlayersRankedQue(): [RankedQueueMember, RankedQueueMember] | null {
    if (this.rankedSearchQueue.length >= 2) {
      return this.rankedSearchQueue.splice(0, 2) as [
        RankedQueueMember,
        RankedQueueMember,
      ];
    }
    return null;
  }

  //Quick queue
  joinQuickQueue(socketID: string, userID?: number) {
    this.quickSearchQueue.push({ socketID, userID });
  }

  leaveQuickQueue(socketID: string) {
    this.removeSocketFromQueue(socketID, this.quickSearchQueue);
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
}
