import * as cheerio  from "cheerio";
import { BaseballTeam } from "./baseballTeam";

/**
 * 順位表
 * 
 * 対応しているリーグ:
 * セリーグ: CL
 * パリーグ: PL
 * セ・パ交流戦: CP
 * オープン戦: OP
 * 
 * Webスクレイピング元: スポーツナビ
 * https://baseball.yahoo.co.jp/npb/standings/detail/1
 * https://baseball.yahoo.co.jp/npb/standings/detail/2
 * https://baseball.yahoo.co.jp/npb/standings/detail/26
 * https://baseball.yahoo.co.jp/npb/standings/detail/5
 * 
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

  const response = await fetch(url); 
  const data = await response.text();
  const $ = cheerio.load(data);

  let teams: BaseballTeam[] = [];
  const isSkipRemainingGames = leagueName === "OP";
  $('.bb-rankTable > tbody > tr').each((_, teamDom) => {
    const rank = Number($(teamDom).find('td:nth-child(1)').text());
    const name = $(teamDom).find('td:nth-child(2)').text().trim();
    const playGameCount = Number($(teamDom).find('td:nth-child(3)').text());
    const win = Number($(teamDom).find('td:nth-child(4)').text());
    const lose = Number($(teamDom).find('td:nth-child(5)').text());
    const draw = Number($(teamDom).find('td:nth-child(6)').text());
    const pct = Number($(teamDom).find('td:nth-child(7)').text());
    const gamesBehind = $(teamDom).find('td:nth-child(8)').text();

    // Webスクレイピング先の順位表にて、
    // 一部リーグに残試合数表記がないという仕様の為調整
    const remainingGames = isSkipRemainingGames ? -1 : Number($(teamDom).find('td:nth-child(9)').text());

    // ※ 残試合数をSkipするか ? index - 1 : index;
    const run = Number($(teamDom).find(`td:nth-child(${10 - Number(isSkipRemainingGames)})`).text());
    const ra = Number($(teamDom).find(`td:nth-child(${11 - Number(isSkipRemainingGames)})`).text());
    const hr = Number($(teamDom).find(`td:nth-child(${12 - Number(isSkipRemainingGames)})`).text());
    const sb = Number($(teamDom).find(`td:nth-child(${13 - Number(isSkipRemainingGames)})`).text());
    const avg = Number($(teamDom).find(`td:nth-child(${14 - Number(isSkipRemainingGames)})`).text());
    const era = Number($(teamDom).find(`td:nth-child(${15 - Number(isSkipRemainingGames)})`).text());
    const e = Number($(teamDom).find(`td:nth-child(${16 - Number(isSkipRemainingGames)})`).text());

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
  });

  return teams;
}

/**
 * 二軍順位表
 * 
 * 対応しているリーグ:
 * イースタンリーグ: E
 * ウエスタンリーグ: W
 * 
 * Webスクレイピング元: パ・リーグ.com
 * https://pacificleague.com/stats/el
 * https://pacificleague.com/stats/wl
 * @param {String} leagueName
 * @returns {Promise<BaseballTeam[]>}
 */
export const farmStandings = async (leagueName: string) => {
  const url = "https://pacificleague.com/stats/"
    + (leagueName === "E" ? "el" : "wl");

  const response = await fetch(url); 
  const data = await response.text();
  const $ = cheerio.load(data);

  let teams: BaseballTeam[] = [];
  $('.c-standings > tbody > tr').each((_, teamDom) => {
    const rank = Number($(teamDom).find('._num').text());
    const name = $(teamDom).find('.c-emblem--a > img').attr('alt');
    const playGameCount = Number($(teamDom).find('td:nth-child(3)').text());
    const win = Number($(teamDom).find('td:nth-child(4)').text());
    const lose = Number($(teamDom).find('td:nth-child(5)').text());
    const draw = Number($(teamDom).find('td:nth-child(6)').text());
    const pct = Number($(teamDom).find('td:nth-child(7)').text());
    const gamesBehind = $(teamDom).find('td:nth-child(8)').text();
    const run = Number($(teamDom).find('td:nth-child(9)').text());
    const ra = Number($(teamDom).find('td:nth-child(10)').text());
    const hr = Number($(teamDom).find('td:nth-child(11)').text());
    const sb = Number($(teamDom).find('td:nth-child(12)').text());
    const avg = Number($(teamDom).find('td:nth-child(13)').text());
    const era = Number($(teamDom).find('td:nth-child(14)').text());

    let team = new BaseballTeam(
      rank,
      name,
      playGameCount,
      win,
      lose,
      draw,
      pct,
      gamesBehind,
      -1,
      run,
      ra,
      hr,
      sb,
      avg,
      era,
      -1
    );
    teams.push(team);
  });

  return teams;
}
