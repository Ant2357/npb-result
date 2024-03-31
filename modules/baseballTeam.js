
module.exports = class BaseballTeam {

  /**
   *Creates an instance of BaseballTeam.
   */
  constructor() {
    this.rank = 0;
    this.name = "";
    this.playGameCount = 0;
    this.win = 0;
    this.lose = 0;
    this.draw = 0;
    this.pct = 0.0;
    this.gamesBehind = 0.0;
    this.remainingGames = 0;
    this.run = 0;
    this.ra = 0;
    this.hr = 0;
    this.sb = 0;
    this.avg = 0;
    this.era = 0.0;

    // Webスクレイピング先に無い独自値
    // Pythagenpat(ピタゴラス勝率の改良型)
    this.pythagenPat = 0.0;
  }

  /**
   * 順位表Tableの値を取り出してメンバ変数に格納
   * @param {DOM} tableDom
   * @param {string} leagueName
   */
  setStandings(tableDom, leagueName) {
    const isRegularGame = leagueName === "CL" || leagueName === "PL" || leagueName === "CP";

    // Webスクレイピング先の順位表にて、
    // オープン戦だけ残試合数表記がないという仕様の為調整
    // ※ is公式戦 ? index + 1 : index;
    const run = Number(tableDom.children().eq(8 + isRegularGame).text());
    const ra = Number(tableDom.children().eq(9 + isRegularGame).text());
    const playGameCount = Number(tableDom.children().eq(2).text());

    const rank = tableDom.children().eq(0).text().replace(/[^0-9]/g, "");
    this.rank = Number(rank);
    this.name = tableDom.children().eq(1).text().trim();
    this.playGameCount = playGameCount
    this.win = Number(tableDom.children().eq(3).text());
    this.lose = Number(tableDom.children().eq(4).text());
    this.draw = Number(tableDom.children().eq(5).text());
    this.pct = Number(tableDom.children().eq(6).text());
    this.gamesBehind = tableDom.children().eq(7).text();
    this.remainingGames = isRegularGame ? Number(tableDom.children().eq(8).text()) : 0;
    this.run = run;
    this.ra = ra;
    this.hr = Number(tableDom.children().eq(10 + isRegularGame).text());
    this.sb = Number(tableDom.children().eq(11 + isRegularGame).text());
    this.avg = Number(tableDom.children().eq(12 + isRegularGame).text());
    this.era = Number(tableDom.children().eq(13 + isRegularGame).text());

    // Webスクレイピング先に無い独自値
    // Pythagenpat(ピタゴラス勝率の改良型)
    const x = ((run + ra) / playGameCount) ** 0.287;
    const pythagenPat = (run ** x) / (run ** x + ra ** x);
    this.pythagenPat = Math.round(pythagenPat * 1000) / 1000;
  }
}
