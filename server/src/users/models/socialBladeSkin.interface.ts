import { Interface } from 'readline';

export interface SocialBladeSkinInterface {
  id?: number;
  name?: string;
  path?: string;
  purchasable?: boolean;
  priceInCredits?: number;
  priceInEuro?: number;
}
