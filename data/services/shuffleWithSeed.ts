const random = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const shuffleWithSeed = <T>(array: T[], seed: number): T[] => {
  const copiedArray = array.slice();
  let m = copiedArray.length,
    t: T,
    i: number;

  while (m) {
    i = Math.floor(random(seed) * m--);

    t = copiedArray[m];
    copiedArray[m] = copiedArray[i];
    copiedArray[i] = t;
    ++seed;
  }

  return copiedArray;
};

export default shuffleWithSeed;
