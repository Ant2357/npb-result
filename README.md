npb-result(NPB Web API)
===

日本プロ野球の順位表情報を返す Web API です。

## Usage

### Central League(セ・リーグ)
`GET https://npb-result.ant-npb.workers.dev/api/cl`

### Pacific League(パ・リーグ)
`GET https://npb-result.ant-npb.workers.dev/api/pl`

### Interleague Game(セ・パ交流戦)
`GET https://npb-result.ant-npb.workers.dev/api/cp`

### Exhibition Game(オープン戦)
`GET https://npb-result.ant-npb.workers.dev/api/op`

### Eastern League(イースタンリーグ)
`GET https://npb-result.ant-npb.workers.dev/api/el`

### Western League(ウエスタンリーグ)
`GET https://npb-result.ant-npb.workers.dev/api/wl`


## Example

### Request
```sh
GET https://npb-result.ant-npb.workers.dev/api/cl
```
### Response
```json
[
  {
    "id": 1,
    "rank": 1,
    "name": "巨人",
    "playGameCount": 3,
    "win": 3,
    "lose": 0,
    "draw": 0,
    "pct": 1,
    "gamesBehind": "-",
    "remainingGames": 140,
    "run": 21,
    "ra": 5,
    "hr": 3,
    "sb": 1,
    "avg": 0.342,
    "era": 0.96,
    "e": 1,
    "pythagenPat": 0.935
  },
  {
    "id": 2,
    "rank": 2,
    "name": "阪神",
    "playGameCount": 3,
    "win": 2,
    "lose": 1,
    "draw": 0,
    "pct": 0.667,
    "gamesBehind": "1",
    "remainingGames": 140,
    "run": 7,
    "ra": 4,
    "hr": 2,
    "sb": 0,
    "avg": 0.202,
    "era": 1.38,
    "e": 1,
    "pythagenPat": 0.693
  },
  ……
]
```

> [!WARNING]
> オープン戦・二軍リーグに関しては remainingGames(残試合) を返しません

## Author
[@ant2357](https://twitter.com/ant2357)
