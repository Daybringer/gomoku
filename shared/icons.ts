import { Achievement } from "./achievements";
enum ProfileIcon {
  transparent = "transparent",
  defaultBoy = "defaultBoy",
  ninja = "ninja",
  origamiSwan = "origamiSwan",
  penguin = "penguin",
  noodles = "noodles",
  godzilla = "godzilla",
  onigiri = "onigiri",
  angel = "angel",
  devil = "devil",
  succubus = "succubus",
  octopus = "octopus",
  chineseMan = "chineseMan",
  king = "king",
  fuji = "fuji",
  pigeon = "pigeon",
  japaneseDrum = "japaneseDrum",
  tori = "tori",
  unicorn = "unicorn",
  lotus = "lotus",
  turtle = "turtle",
  guest = "guest",
}
type ProfileIconKeys = keyof typeof ProfileIcon;
type ProfileIconRecordContent = {
  iconFullName: string;
  description: string;
  purchasable: boolean;
  price: number;
  boundAchievement: Achievement | null;
};
const profileIconRecords: Record<ProfileIconKeys, ProfileIconRecordContent> = {
  transparent: {
    iconFullName: "",
    description: "",
    purchasable: false,
    price: 0,
    boundAchievement: null,
  },
  guest: {
    iconFullName: "guest",
    description: "guest",
    purchasable: false,
    price: 0,
    boundAchievement: null,
  },
  defaultBoy: {
    description:
      "Young farmer dreaming of becoming the best Gomoku player that world has ever seen.",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 0,
    boundAchievement: null,
  },
  ninja: {
    description: "'Ah, you've seen me. I still have to train hard'",
    iconFullName: "Not so sneaky ninja",
    purchasable: true,
    price: 0,
    boundAchievement: null,
  },
  angel: {
    description: "Your good side. The one that stars this project on Github",
    iconFullName: "Angel",
    purchasable: false,
    price: 0,
    boundAchievement: null,
  },
  chineseMan: {
    description:
      "Mysterious man that gets drunk often and tells people that he is a friend of some Mulan or something.",
    iconFullName: "Dragon fighter",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  devil: {
    description: "Your bad side. The one with intrusive thoughts.",
    iconFullName: "Devil",
    purchasable: false,
    price: 100,
    boundAchievement: null,
  },
  fuji: {
    description: "Steep hike to glory well done.",
    iconFullName: "Fuji",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  godzilla: {
    description: "'Hi, I'm a small godzilla and I like warm hugs'",
    iconFullName: "Hugzilla",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  japaneseDrum: {
    description: "Bum, bum, bam, here I come.",
    iconFullName: "Drum of destiny",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  king: {
    description: "Be careful to not get hit.",
    iconFullName: "King of lightning bolts",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  lotus: {
    description: "Get captivated by it's beauty.",
    iconFullName: "Blossoming lotus",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  noodles: {
    description: "Hmmmm, yummy.",
    iconFullName: "Ramen-chan",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  octopus: {
    description:
      "A powerful user of Ki. I would advise to not take a fight with it.",
    iconFullName: "Octo-sensei",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  onigiri: {
    description:
      "A ball full of rice that seeks revenge on his lifelong rival Ramen-chan.",
    iconFullName: "Onigiri-kun",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  origamiSwan: {
    description: "It's a crane, paper crane.",
    iconFullName: "Orizuru",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  penguin: {
    description:
      "Looks sweet and all, but the opponent shouldn't get fooled by it's appearance. Pingu is a tough opponent.",
    iconFullName: "Pingu",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  pigeon: {
    description: "Get a tie, get an icon",
    iconFullName: "Peacemaker",
    purchasable: false,
    price: 0,
    boundAchievement: null,
  },
  succubus: {
    description: "Neat.",
    iconFullName: "Mighty succubus",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  tori: {
    description: "It's said that the path to glory starts in one of these.",
    iconFullName: "Tori",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
  turtle: {
    description: "Favourite icon of my girl.",
    iconFullName: "Cute turtle",
    purchasable: true,
    price: 0,
    boundAchievement: null,
  },
  unicorn: {
    description: "Don't get trapped by it's charm.",
    iconFullName: "Unicorn of love",
    purchasable: true,
    price: 100,
    boundAchievement: null,
  },
};

export { ProfileIcon, profileIconRecords, ProfileIconRecordContent };
