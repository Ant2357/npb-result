
module.exports = class Starter {

  /**
   *Creates an instance of Starter.
   */
  constructor(gameDay, ballpark, homeTeamName, awayTeamName, homeStarterName, awayStarterName) {
    this.gameDay = gameDay;
    this.ballpark = ballpark;
    this.homeTeamName = homeTeamName;
    this.awayTeamName = awayTeamName;
    this.homeStarterName = homeStarterName;
    this.awayStarterName = awayStarterName;
  }
}
