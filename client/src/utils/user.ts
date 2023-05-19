import { User } from '@/shared/interfaces/user.interface';

// Matches
function getTotalQuick(user: User): number {
    return user.quickLost + user.quickTied + user.quickWon;
}
function getTotalRanked(user: User): number {
    return user.rankedLost + user.rankedTied + user.rankedWon;
}
function getTotalMatches(user: User): number {
    return getTotalQuick(user) + getTotalRanked(user);
}
function getTotalWon(user: User): number {
    return user.rankedWon + user.quickWon;
}
function getTotalLost(user: User): number {
    return user.rankedLost + user.quickLost;
}
function getTotalTie(user: User): number {
    return user.rankedTied + user.quickTied;
}

export { getTotalQuick, getTotalRanked, getTotalMatches, getTotalWon, getTotalTie, getTotalLost }