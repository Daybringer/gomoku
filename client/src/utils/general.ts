function capitalize(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function humanReadableTime(timeInMS: number) {
  const time = Math.floor(timeInMS / 1000);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${
    seconds == 0 ? "00" : seconds < 10 ? "0" + seconds : seconds
  }`;
}

export { capitalize, humanReadableTime };
