const client = require("cheerio-httpcli");
const BaseballTeam = require("./modules/baseballTeam");
const Starter = require("./modules/starter");

/**
 * 順位表
 * 
 * 対応しているリーグ:
 * セリーグ: CL,
 * パリーグ: PL,
 * セ・パ交流戦: CP,
 * オープン戦: OP
 * @param {String} leagueName
 * @returns {Promise<Array>}
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

  const web = await client.fetch(url);
  if (web.response.request.uri.href !== url) {
    return [];
  }

  const searchNum = leagueName === "OP" || leagueName === "CP" ? 12 : 6;
  let teams = [];
  web.$('.bb-rankTable > tbody > tr').each(function (idx) {
    if (idx < searchNum) {
      let team = new BaseballTeam();
      team.setStandings(web.$(this), leagueName);
      teams.push(team);
    }
  });

  return teams;
}

/**
 * 予告先発
 * 
 * @returns {Array}
 */
exports.starter = async () => {
  const url = "https://npb.jp/announcement/starter/";

  const web = await client.fetch(url);
  if (web.response.request.uri.href !== url) {
    return [];
  }

  let res = [];
  web.$(".unit").each(function () {
    const ballpark = web.$(this).children().eq(4).text()
      .replace(/\r?\n/g, "")
      .trim()
      .replace(/((0?|1)[0-9]|2[0-3])[:][0-5][0-9]/g, "")
      .replace(/（|）/g, "");

    if (ballpark.length === 0) {
      return;
    }

    let gameDay = "";
    web.$(".contents").each(function () {
      const day = `${new Date().getFullYear()}-${web.$(this).children().eq(0).children().eq(0).text()
        .replace(/の予告先発投手/g, "")
        .replace(/月/g, "-")
        .replace(/日/g, "")}`;

      gameDay = day;
    });

    const homeTeamName = web.$(this).children().eq(1).children().eq(0).attr("title");
    const awayTeamName = web.$(this).children().eq(3).children().eq(0).attr("title");

    const homeStarterName = web.$(this).children().eq(1).text().trim();
    const awayStarterName = web.$(this).children().eq(3).text().trim();

    let starter = new Starter(
      // 試合日
      gameDay,
      // 球場名
      ballpark,
      // ホームチーム
      homeTeamName,
      // アウェーチーム
      awayTeamName,
      //ホーム側の先発
      homeStarterName,
      //アウェー側の先発
      awayStarterName
    );

    res.push(starter);
  });

  return res;
}