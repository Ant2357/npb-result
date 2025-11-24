import { BaseballTeam } from "./npb/baseballTeam"

/**
 * 許可するテーブル
 */
const ALLOWED_TABLES = [
  "central_league",
  "pacific_league",
  "interleague_game",
  "exhibition_game",
];

/**
 * 許可されたテーブルか確認
 */
const assertValidTable = (name: string) => {
  if (!ALLOWED_TABLES.includes(name)) {
    throw new Error(`Invalid table name: ${name}`);
  }
};

/**
 * 全件取得
 */
export async function selectAll(db: D1Database, table: string): Promise<any[]> {
  assertValidTable(table);
  const { results } = await db.prepare(`SELECT * FROM ${table}`).all();
  return results ?? [];
}

/**
 * 順位表更新(DELETE → INSERT)
 */
export async function updateDBStandings(
  db: D1Database,
  table: string,
  teams: BaseballTeam[]
): Promise<void> {
  assertValidTable(table);

  // 1. DELETE 文
  const queries: D1PreparedStatement[] = [
    db.prepare(`DELETE FROM ${table}`)
  ];

  // 2. INSERT 文(複数処理を積む)
  const insertSql = `
    INSERT INTO ${table}
    (rank, name, playGameCount, win, lose, draw, pct, gamesBehind, remainingGames, run, ra, hr, sb, avg, era, e, pythagenPat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const team of teams) {
    queries.push(
      db
        .prepare(insertSql)
        .bind(
          team.rank,
          team.name,
          team.playGameCount,
          team.win,
          team.lose,
          team.draw,
          team.pct,
          team.gamesBehind,
          team.remainingGames,
          team.run,
          team.ra,
          team.hr,
          team.sb,
          team.avg,
          team.era,
          team.e,
          team.pythagenPat
        )
    );
  }

  // 3. トランザクションで一括実行
  await db.batch(queries);
}
