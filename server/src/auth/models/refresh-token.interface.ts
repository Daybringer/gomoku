export interface RefreshTokenInterface {
  id: number;
  userUUID: string;
  isRevoked: boolean;
  expires: Date;
}
