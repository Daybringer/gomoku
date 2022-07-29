enum Achievement {
  reachWarrior = "reachWarrior",
  reachSamurai = "reachSamurai",
  reachChampion = "reachChampion",
  playAny100 = "playAny100",
  rightOnTime = "rightOnTime",
  closeRace = "closeRace",
  beTop50 = "beTop50",
  beTop25 = "beTop25",
  beTop1 = "beTop1",
}

type AchievementKeys = keyof typeof Achievement;

const achievementRecords: Record<
  AchievementKeys,
  { achievementFullName: string; description: string }
> = {
  reachWarrior: { achievementFullName: "Warrior player", description: "" },
  reachSamurai: { achievementFullName: "Samurai player", description: "" },
  reachChampion: { achievementFullName: "Champion player", description: "" },
  playAny100: {
    achievementFullName: "Casual Gomoku enjoyer",
    description: "Play 100 games of any format.",
  },
  rightOnTime: {
    achievementFullName: "Right on time",
    description: "Win a ranked game with less then 1 second remaining.",
  },
  closeRace: {
    achievementFullName: "Close race",
    description:
      "Win a ranked game when each player has less then 5 seconds remaining.",
  },
  beTop50: { achievementFullName: "Warrior player", description: "" },
  beTop25: { achievementFullName: "Warrior player", description: "" },
  beTop1: { achievementFullName: "On top of the world", description: "" },
};

export { Achievement, achievementRecords };
