"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseballTeam = void 0;
class BaseballTeam {
    rank;
    name;
    playGameCount;
    win;
    lose;
    draw;
    pct;
    gamesBehind;
    remainingGames;
    run;
    ra;
    hr;
    sb;
    avg;
    era;
    pythagenPat;
    // Webスクレイピング先に無い独自値
    // Pythagenpat(ピタゴラス勝率の改良型)
    get calcPythagenPat() {
        const x = ((this.run + this.ra) / this.playGameCount) ** 0.287;
        const pythagenPat = (this.run ** x) / (this.run ** x + this.ra ** x);
        return Math.round(pythagenPat * 1000) / 1000;
    }
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
        this.pythagenPat = this.calcPythagenPat;
    }
}
exports.BaseballTeam = BaseballTeam;
