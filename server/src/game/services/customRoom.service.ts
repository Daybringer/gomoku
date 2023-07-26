import { GameSettingsIdless } from '../../shared/interfaces/gameSettings.interface';
import { Injectable } from '@nestjs/common';
import { CreateCustomDTO, SocketIOEvents } from 'src/shared/socketIO';
import { Socket } from 'socket.io';

@Injectable()
export class CustomRoomService {
  customWaitingRooms: {
    [roomID: string]: {
      waitingPlayersSockets: Array<Socket>;
      settings: GameSettingsIdless;
    };
  } = {};

  private generateRoomID(...rooms: Record<string, unknown>[]) {
    const IDLength = 6;

    for (let x = 0; x < 100; x++) {
      const randID = Math.random()
        .toString(36)
        .substr(2, IDLength)
        .toUpperCase();

      let isTaken = false;

      rooms.forEach((room) => {
        if (room.hasOwnProperty(randID)) {
          isTaken = true;
        }
      });

      if (!isTaken) {
        return randID;
      } else {
        throw 'generateRoomID overlooped';
      }
    }
  }

  createCustomWaitingRoom(createCustomDTO: CreateCustomDTO): string {
    const roomID = this.generateRoomID(this.customWaitingRooms);
    this.customWaitingRooms[roomID] = {
      waitingPlayersSockets: [],
      settings: createCustomDTO.gameSettings,
    };
    return roomID;
  }

  getGameSettings(roomID: string): GameSettingsIdless {
    return this.customWaitingRooms[roomID].settings;
  }

  joinCustomWaitingRoom(socket: Socket, roomID: string): void {
    if (this.customWaitingRooms[roomID]) {
      if (!this.isCustomWaitingRoomFull(roomID)) {
        this.customWaitingRooms[roomID].waitingPlayersSockets.push(socket);
      } else {
        socket.emit(SocketIOEvents.InvalidCustomRoom);
      }
    } else {
      socket.emit(SocketIOEvents.InvalidCustomRoom);
    }
  }

  isCustomWaitingRoomFull(roomID: string): boolean {
    return this.customWaitingRooms[roomID].waitingPlayersSockets.length >= 2;
  }

  getAllWaitingPlayersIDs(roomID: string): Socket[] {
    return this.customWaitingRooms[roomID].waitingPlayersSockets;
  }

  deleteCustomWaitingRoom(roomID: string): void {
    delete this.customWaitingRooms[roomID];
  }

  findCustomWaitingRoomIDBySocket(socket: Socket): string {
    const keys = Object.keys(this.customWaitingRooms);
    for (let i = 0; i < keys.length; i++) {
      const currWaitingRoom = this.customWaitingRooms[keys[i]];
      if (currWaitingRoom.waitingPlayersSockets.includes(socket)) {
        return keys[i];
      }
    }
    return '';
  }
}
