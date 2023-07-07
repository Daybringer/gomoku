import { User } from "@/shared/interfaces/user.interface";

// Matches
function getTotalQuick(user: User): number {
  return (
    user.statistics.quickLost +
    user.statistics.quickTied +
    user.statistics.quickWon
  );
}
function getTotalRanked(user: User): number {
  return (
    user.statistics.rankedLost +
    user.statistics.rankedTied +
    user.statistics.rankedWon
  );
}
function getTotalMatches(user: User): number {
  return getTotalQuick(user) + getTotalRanked(user);
}
function getTotalWon(user: User): number {
  return user.statistics.rankedWon + user.statistics.quickWon;
}
function getTotalLost(user: User): number {
  return user.statistics.rankedLost + user.statistics.quickLost;
}
function getTotalTie(user: User): number {
  return user.statistics.rankedTied + user.statistics.quickTied;
}

export {
  getTotalQuick,
  getTotalRanked,
  getTotalMatches,
  getTotalWon,
  getTotalTie,
  getTotalLost,
};
