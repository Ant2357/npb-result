npb-result(NPB Web API)
===

日本プロ野球の順位表情報を返す Web API です。

## 使い方

### Central League(セ・リーグ)
`GET https://npb-result.ant-npb.workers.dev/api/cl`

### Pacific League(パ・リーグ)
`GET https://npb-result.ant-npb.workers.dev/api/pl`

### Interleague Game(セ・パ交流戦)
`GET https://npb-result.ant-npb.workers.dev/api/cp`

### Exhibition Game(オープン戦)
`GET https://npb-result.ant-npb.workers.dev/api/op`

### Eastern League(イースタンリーグ)
`GET https://npb-result.ant-npb.workers.dev/api/farm/e`

### Western League(ウエスタンリーグ)
`GET https://npb-result.ant-npb.workers.dev/api/farm/w`

## Result
```
[
  {
    "id": 1,
    "rank": 1,
    "name": "阪神",
    "playGameCount": 21,
    "win": 11,
    "lose": 8,
    "draw": 2,
    "pct": 0.579,
    "gamesBehind": "-",
    "remainingGames": 122,
    "run": 66,
    "ra": 50,
    "hr": 13,
    "sb": 7,
    "avg": 0.224,
    "era": 2.06,
    "e": 7,
    "pythagenPat": 0.611
  },
  {
    "id": 2,
    "rank": 2,
    "name": "中日",
    "playGameCount": 20,
    "win": 10,
    "lose": 8,
    "draw": 2,
    "pct": 0.556,
    "gamesBehind": "0.5",
    "remainingGames": 123,
    "run": 51,
    "ra": 66,
    "hr": 5,
    "sb": 3,
    "avg": 0.243,
    "era": 3.18,
    "e": 7,
    "pythagenPat": 0.395
  },
  .
  .
  .
]
```

## Author
[@ant2357](https://twitter.com/ant2357)
