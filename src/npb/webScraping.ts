import { JSDOM } from "jsdom";
import { BaseballTeam } from "./baseballTeam";

/**
 * 順位表
 * 
 * 対応しているリーグ:
 * セリーグ: CL,
 * パリーグ: PL,
 * セ・パ交流戦: CP,
 * オープン戦: OP
 * @param {String} leagueName
 * @returns {Promise<BaseballTeam[]>}
 */
export const standings = async (leagueName: string) => {

  type LeagueUrls = {
    [key: string]: string
  };
  const leagueUrls: LeagueUrls = {
    "CL": "1",
    "PL": "2",
    "CP": "26",
    "OP": "5"
  };

  const url = "https://baseball.yahoo.co.jp/npb/standings/detail/"
    + leagueUrls[(typeof leagueUrls[leagueName] === "undefined" ? "CL" : leagueName)];

  const dom = await JSDOM.fromURL(url);
  const document = dom.window.document;
  const tableRows = document.querySelectorAll('.bb-rankTable > tbody > tr');

  let teams: BaseballTeam[] = [];
  const isOP = leagueName === "OP";
  const domNullFiletr = (element: Element | null) => {
    if (element!== null && element.textContent !== null) {
      return element.textContent.trim();
    }
    return "";
  }
  for (let i = 0; i < tableRows.length; i++) {
    const rank = Number(domNullFiletr(tableRows[i]?.querySelector('td:nth-child(1)')));
    const name = domNullFiletr(tableRows[i].querySelector('td:nth-child(2)'));
    const playGameCount = Number(domNullFiletr(tableRows[i].querySelector('td:nth-child(3)')));
    const win = Number(domNullFiletr(tableRows[i].querySelector('td:nth-child(4)')));
    const lose = Number(domNullFiletr(tableRows[i].querySelector('td:nth-child(5)')));
    const draw = Number(domNullFiletr(tableRows[i].querySelector('td:nth-child(6)')));
    const pct = Number(domNullFiletr(tableRows[i].querySelector('td:nth-child(7)')));
    const gamesBehind = domNullFiletr(tableRows[i].querySelector('td:nth-child(8)'));

    // Webスクレイピング先の順位表にて、
    // オープン戦だけ残試合数表記がないという仕様の為調整
    // ※ isオープン戦 ? index - 1 : index - 0;
    const remainingGames = !isOP ? Number(domNullFiletr(tableRows[i].querySelector('td:nth-child(9)'))) : 0;
    const run = Number(domNullFiletr(tableRows[i].querySelector(`td:nth-child(${10 - Number(isOP)})`)));
    const ra = Number(domNullFiletr(tableRows[i].querySelector(`td:nth-child(${11 - Number(isOP)})`)));
    const hr = Number(domNullFiletr(tableRows[i].querySelector(`td:nth-child(${12 - Number(isOP)})`)));
    const sb = Number(domNullFiletr(tableRows[i].querySelector(`td:nth-child(${13 - Number(isOP)})`)));
    const avg = Number(domNullFiletr(tableRows[i].querySelector(`td:nth-child(${14 - Number(isOP)})`)));
    const era = Number(domNullFiletr(tableRows[i].querySelector(`td:nth-child(${15 - Number(isOP)})`)));
    const e = Number(domNullFiletr(tableRows[i].querySelector(`td:nth-child(${16 - Number(isOP)})`)));

    let team = new BaseballTeam(
      rank,
      name,
      playGameCount,
      win,
      lose,
      draw,
      pct,
      gamesBehind,
      remainingGames,
      run,
      ra,
      hr,
      sb,
      avg,
      era,
      e
    );
    teams.push(team);
  }

  return teams;
}
