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
}
// TODO complete all names and descriptions
type ProfileIconKeys = keyof typeof ProfileIcon;
type ProfileIconRecordContent = {
  iconFullName: string;
  description: string;
  purchasable: boolean;
  price: number;
  boundAchievementID: null | number;
};
const profileIconRecords: Record<ProfileIconKeys, ProfileIconRecordContent> = {
  transparent: {
    iconFullName: "",
    description: "",
    purchasable: false,
    price: 0,
    boundAchievementID: 9292,
  },
  defaultBoy: {
    description:
      "Labore laboris nulla est minim minim sit aute velit. Lorem velit et sint sint qui ullamco eu.",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  ninja: {
    description: "",
    iconFullName: "Sneaky ninja",
    purchasable: true,
    price: 0,
    boundAchievementID: null,
  },
  angel: {
    description: "Some text asdfasdfjkla asdf we lorem dolorem ipsum.",
    iconFullName: "Angel ",
    purchasable: false,
    price: 0,
    boundAchievementID: 1,
  },
  chineseMan: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  devil: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  fuji: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  godzilla: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  japaneseDrum: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  king: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  lotus: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  noodles: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  octopus: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  onigiri: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  origamiSwan: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  penguin: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  pigeon: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  succubus: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  tori: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  turtle: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
  unicorn: {
    description: "",
    iconFullName: "Valiant farmer",
    purchasable: true,
    price: 100,
    boundAchievementID: null,
  },
};

export { ProfileIcon, profileIconRecords, ProfileIconRecordContent };