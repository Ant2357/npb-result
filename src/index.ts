/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import * as npb from "./npb/webScraping";
import { updateDBStandings, selectAll } from "./dbClient";
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
      const results = await selectAll(env.DB, "central_league");
      return Response.json(results, { headers: corsHeaders });
    }

    // パ・リーグ
    if (pathname === "/api/pl") {
      const results = await selectAll(env.DB, "pacific_league");
      return Response.json(results, { headers: corsHeaders });
    }

    // セ・パ交流戦
    if (pathname === "/api/cp") {
      const results = await selectAll(env.DB, "interleague_game");
      return Response.json(results, { headers: corsHeaders });
    }

    // オープン線
    if (pathname === "/api/op") {
      let results = await selectAll(env.DB, "exhibition_game");

      // 現時点で Webスクレイピング先に無い指標の削除
      results.forEach((team) => { delete team.remainingGames; });

      return Response.json(results, { headers: corsHeaders });
    }

    return Response.json([
      { title: 'Central League', url: "/api/cl" },
      { title: 'Pacific League', url: "/api/pl" },
      { title: 'Interleague Play', url: "/api/cp" },
      { title: 'Exhibition Game', url: "/api/op" }
    ]);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const cl = await npb.standings("CL");
    const pl = await npb.standings("PL");
    const cp = await npb.standings("CP");
    const op = await npb.standings("OP");

    // 順位結果が取得出来なかった際は更新を行わない
    if (cl.length === 0) {
      return;
    }

    // updateDBStandings は内部でテーブル名検証を行っているため直接渡してOK
    await updateDBStandings(env.DB, "central_league", cl);
    await updateDBStandings(env.DB, "pacific_league", pl);
    await updateDBStandings(env.DB, "interleague_game", cp);
    await updateDBStandings(env.DB, "exhibition_game", op);
  },
}
