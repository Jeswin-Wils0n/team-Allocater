const mysqlQueries = require("../connections/MySQL/DB_operations");
const { appLogger, meteredLogger } = require("../logger/logger");
const { queryExecution } = require("../connections/MySQL/DB_querrys");
const supportFunctions = require("./supportFunctions");
const xlsx = require('xlsx');

module.exports = {
  createTeams: function createTeams(players, individualItems,groupEvents,numTeams,teamNames) {
    appLogger.info("createTeams function -started", { filename: __filename, functionname: "teamGeneration" });
    const startTime = new Date();
    try{
      players.forEach((player) => {
        player.allocations = 0;
        player.mappedTeam = "";
        player.includedRatings = [];
      });
  
      const individualItemArrays = supportFunctions.createSortedArrays(
        players,
        individualItems
      );
  
      let teams = Array(numTeams)
        .fill([])
        .map((_, index) => ({
          players: [],
          name: teamNames[index] || `Team ${index + 1}`,
          team_strength: 0,
        }));
      const teamStrengths = Array(numTeams).fill(0);
  
      teams = supportFunctions.allocatePlayers(
        individualItemArrays,
        teams,
        teamStrengths
      );
  
      teams = supportFunctions.addGroupEventRatings(teams, players, groupEvents);
  
      teams.sort(
        (a, b) => teamStrengths[a.length - 1] - teamStrengths[b.length - 1]
      );
  
      if (players.some((player) => player.allocations === 0)) {
        const groupEventArrays = supportFunctions.createSortedArrays(
          players,
          groupEvents
        );
        supportFunctions.allocatePlayers(groupEventArrays, teams, teamStrengths);
      }
  
      // if (players.some((player) => player.mappedTeam === "")) {
      //   throw new Error("Error: Some players were not allocated to any team.");
      // }
  
      const finalResult = teams.map((team) => ({
        players: team.players,
        name: team.name,
        team_strength: team.team_strength,
      }));
  
      return finalResult;

      
    }catch (e){

      return(e.message)
    }
    
  },

  parseExcelFile: function parseExcelFile(filePath) {

    try{
      const workbook = xlsx.readFile(filePath);
      const playersSheet = workbook.Sheets['Players'];
      const playersData = xlsx.utils.sheet_to_json(playersSheet);
      const detailsSheet = workbook.Sheets['Details'];
      const detailsData = xlsx.utils.sheet_to_json(detailsSheet);
      const numTeams = parseInt(detailsData[0]['Number of teams']);
      const teamNames = detailsData.map(row => row['Team names']).filter(name => name);
      const groupEvents = detailsData.map(row => row['Group Events']).filter(event => event);
      const individualEvents = detailsData.map(row => row['Individual Events']).filter(event => event);
    
      const players = playersData.map(player => {
        const formattedPlayer = {
          name: player['Emp Name'],
          ...individualEvents.reduce((acc, event) => {
            acc[event] = parseInt(player[event]) || 0;
            return acc;
          }, {})
        };
        return formattedPlayer;
      });
    
      return {
        players,
        numTeams,
        teamNames,
        groupEvents,
        individualEvents
      };
    } catch (e){
      return(e.message)
    }
    
  }
};
