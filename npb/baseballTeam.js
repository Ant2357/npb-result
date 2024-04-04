
module.exports = class BaseballTeam {

  /**
   *Creates an instance of BaseballTeam.
   */
  constructor(rank = 0, name = "", playGameCount = 0, win = 0, lose = 0, draw = 0, pct = 0.0, gamesBehind = "", remainingGames = 0, run = 0, ra = 0, hr = 0, sb = 0, avg = 0.0, era = 0.0) {
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

    // Webスクレイピング先に無い独自値
    // Pythagenpat(ピタゴラス勝率の改良型)
    const x = ((run + ra) / playGameCount) ** 0.287;
    const pythagenPat = (run ** x) / (run ** x + ra ** x);
    this.pythagenPat = Math.round(pythagenPat * 1000) / 1000;
  }
}
