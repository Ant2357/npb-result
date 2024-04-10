
export class BaseballTeam {
  rank: number;
  name: string;
  playGameCount: number;
  win: number;
  lose: number;
  draw: number;
  pct: number;
  gamesBehind: string;
  remainingGames: number;
  run: number;
  ra: number;
  hr: number;
  sb: number;
  avg: number;
  era: number;
  e: number;
  pythagenPat: number;
  // Webスクレイピング先に無い独自値
  // Pythagenpat(ピタゴラス勝率の改良型)
  get calcPythagenPat(): number {
    const x = ((this.run + this.ra) / this.playGameCount) ** 0.287;
    const pythagenPat = (this.run ** x) / (this.run ** x + this.ra ** x);
    return Math.round(pythagenPat * 1000) / 1000;
  }

  /**
   *Creates an instance of BaseballTeam.
   */
  constructor(rank = 0, name = "", playGameCount = 0, win = 0, lose = 0, draw = 0, pct = 0.0, gamesBehind = "", remainingGames = 0, run = 0, ra = 0, hr = 0, sb = 0, avg = 0.0, era = 0.0, e = 0) {
    this.rank = rank;
    this.name = name;
    this.playGameCount = playGameCount;
    this.win = win;
    this.lose = lose;
    this.draw = draw;
    this.pct = pct;
    this.gamesBehind = gamesBehind;
    this.remainingGames = remainingGames;
    this.run = run;
    this.ra = ra;
    this.hr = hr;
    this.sb = sb;
    this.avg = avg;
    this.era = era;
    this.e = e;
    this.pythagenPat = this.calcPythagenPat;
  }
}
