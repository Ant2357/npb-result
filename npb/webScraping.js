const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const BaseballTeam = require("./baseballTeam");

/**
 * 順位表
 * 
 * 対応しているリーグ:
 * セリーグ: CL,
 * パリーグ: PL,
 * セ・パ交流戦: CP,
 * オープン戦: OP
 * @param {String} leagueName
 * @returns {Promise<[BaseballTeam]>}
 */
exports.standings = async (leagueName) => {
  const leagueUrls = {
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

  let teams = [];
  const isOP = leagueName === "OP";
  for (let i = 0; i < tableRows.length; i++) {
    const rank = Number(tableRows[i].querySelector('td:nth-child(1)').textContent.trim());
    const name = tableRows[i].querySelector('td:nth-child(2)').textContent.trim();
    const playGameCount = Number(tableRows[i].querySelector('td:nth-child(3)').textContent.trim());
    const win = Number(tableRows[i].querySelector('td:nth-child(4)').textContent.trim());
    const lose = Number(tableRows[i].querySelector('td:nth-child(5)').textContent.trim());
    const draw = Number(tableRows[i].querySelector('td:nth-child(6)').textContent.trim());
    const pct = Number(tableRows[i].querySelector('td:nth-child(7)').textContent.trim());
    const gamesBehind = tableRows[i].querySelector('td:nth-child(8)').textContent.trim();

    // Webスクレイピング先の順位表にて、
    // オープン戦だけ残試合数表記がないという仕様の為調整
    // ※ isオープン戦 ? index - 1 : index - 0;
    const remainingGames = !isOP ? Number(tableRows[i].querySelector('td:nth-child(9)').textContent.trim()) : 0;
    const run = Number(tableRows[i].querySelector(`td:nth-child(${10 - isOP})`).textContent.trim());
    const ra = Number(tableRows[i].querySelector(`td:nth-child(${11 - isOP})`).textContent.trim());
    const hr = Number(tableRows[i].querySelector(`td:nth-child(${12 - isOP})`).textContent.trim());
    const sb = Number(tableRows[i].querySelector(`td:nth-child(${13 - isOP})`).textContent.trim());
    const avg = Number(tableRows[i].querySelector(`td:nth-child(${14 - isOP})`).textContent.trim());
    const era = Number(tableRows[i].querySelector(`td:nth-child(${15 - isOP})`).textContent.trim());

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
      era
    );
    teams.push(team);
  }

  return teams;
}
