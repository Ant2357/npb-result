/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { BaseballTeam } from "./npb/baseballTeam";
import * as npb from "./npb/webScraping";
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;

  DB: D1Database;
}

const updateDBStandings = async (env: Env, leagueName: string, teams: BaseballTeam[]): Promise<void> => {
  await env.DB.prepare(`DELETE FROM ${leagueName}`).run();
  for (const team of teams) {
    await env.DB.prepare(
      `INSERT INTO ${leagueName}
      (rank, name, playGameCount, win, lose, draw, pct, gamesBehind, remainingGames, run, ra, hr, sb, avg, era, e, pythagenPat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      team.rank, team.name, team.playGameCount, team.win, team.lose, team.draw, team.pct, team.gamesBehind, team.remainingGames, team.run, team.ra, team.hr, team.sb, team.avg, team.era, team.e, team.pythagenPat
    ).run();
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
    };

    const { pathname } = new URL(request.url);

    // セ・リーグ
    if (pathname === "/api/cl") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM central_league"
      ).all();

      return Response.json(results, { headers: corsHeaders });
    }

    // パ・リーグ
    if (pathname === "/api/pl") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM pacific_league"
      ).all();

      return Response.json(results, { headers: corsHeaders });
    }

    // セ・パ交流戦
    if (pathname === "/api/cp") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM interleague_game"
      ).all();

      return Response.json(results, { headers: corsHeaders });
    }

    // オープン線
    if (pathname === "/api/op") {
      let { results } = await env.DB.prepare(
        "SELECT * FROM exhibition_game"
      ).all();

      // 現時点での Webスクレイピング先に無い指標を削除
      results.forEach(team => { delete team.remainingGames; });

      return Response.json(results, { headers: corsHeaders });
    }


    // ファーム
    // イースタンリーグ
    if (pathname === "/api/el") {
      let results = await npb.farmStandings("E");

      // 現時点での Webスクレイピング先に無い指標を削除
      results.forEach(team => {
        delete team.remainingGames;
        delete team.e;
      });

      return Response.json(results, { headers: corsHeaders });
    };

    // ウエスタンリーグ
    if (pathname === "/api/wl") {
      let results = await npb.farmStandings("W");

      // 現時点での Webスクレイピング先に無い指標を削除
      results.forEach(team => {
        delete team.remainingGames;
        delete team.e;
      });

      return Response.json(results, { headers: corsHeaders });
    }

    return Response.json([
      { title: 'Central League', url: "/api/cl" },
      { title: 'Pacific League', url: "/api/pl" },
      { title: 'Interleague Play', url: "/api/cp" },
      { title: 'Exhibition Game', url: "/api/op" },

      { title: 'Eastern League', url: "/api/el" },
      { title: 'Western League', url: "/api/wl" },
    ]);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const cl = await npb.standings("CL");
    const pl = await npb.standings("PL");
    const cp = await npb.standings("CP");
    const op = await npb.standings("OP");

    // 二軍リーグ
    const el = await npb.farmStandings("E");
    const wl = await npb.farmStandings("W");

    // 順位結果が取得出来なかった際は更新を行わない
    if (cl.length === 0) {
      return;
    }

    await updateDBStandings(env, "central_league", cl);
    await updateDBStandings(env, "pacific_league", pl);
    await updateDBStandings(env, "interleague_game", cp);
    await updateDBStandings(env, "exhibition_game", op);

    await updateDBStandings(env, "eastern_league", el);
    await updateDBStandings(env, "western_league", wl);
  },

}
