import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/shared/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
interface RankedQueueMember {
  socketID: string;
  userID: number;
  elo: number;
}
@Injectable()
export class SearchService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  quickSearchQueue: string[] = [];
  rankedSearchQueue: RankedQueueMember[] = [];
  // socketID, userID, elo

  //Ranked queue
  async verifyJwt(socketID: string, token: string): Promise<RankedQueueMember> {
    const payload = this.jwtService.verify(token);
    const userID = payload.sub;
    const user = await this.usersService.findOneByID(userID);
    if (!user) throw 'User not found';
    return { elo: user.elo, socketID, userID: user.id };
  }

  joinRankedQueue(member: RankedQueueMember) {
    this.rankedSearchQueue.push(member);
  }

  leaveRankedQueue(socketID: string) {
    let leaverQueueIndex: number;
    let flag = false;
    this.rankedSearchQueue.forEach((member, index) => {
      if (member.socketID === socketID) {
        flag = true;
        leaverQueueIndex = index;
      }
    });

    if (flag) this.rankedSearchQueue.splice(leaverQueueIndex, 1);
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
  joinQuickQueue(socketID: string) {
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
