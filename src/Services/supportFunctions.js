const mysqlQueries = require("../connections/MySQL/DB_operations");
const { appLogger, meteredLogger } = require("../logger/logger");
const { queryExecution } = require("../connections/MySQL/DB_querrys");

module.exports = {
  createSortedArrays: function createSortedArrays(players, items) {
    const itemArrays = {};
    const highestRatings = {};

    for (const item of items) {
      const filteredPlayers = players.filter((player) => player[item] > 0);
      if (filteredPlayers.length > 0) {
        highestRatings[item] = Math.max(
          ...filteredPlayers.map((player) => player[item])
        );
        itemArrays[item] = filteredPlayers.sort((a, b) => {
          const ratingDiff = b[item] - a[item];
          return ratingDiff !== 0 ? ratingDiff : a.name.localeCompare(b.name);
        });
      } else {
        itemArrays[item] = filteredPlayers;
      }
    }

    return Object.fromEntries(
      Object.entries(itemArrays).sort((a, b) => {
        const countDiff =
          a.filter((player) => player[a[0]] === highestRatings[a[0]]).length -
          b.filter((player) => player[b[0]] === highestRatings[b[0]]).length;
        return countDiff !== 0
          ? countDiff
          : highestRatings[a[0]] - highestRatings[b[0]];
      })
    );
  },

  allocatePlayers: function allocatePlayers(itemArrays, teams, teamStrengths) {
    let teamIndex = 0;

    for (const itemArray in itemArrays) {
        itemArrays[itemArray].sort((a, b) => b[itemArray] - a[itemArray]);

        for (const player of itemArrays[itemArray]) {
            if (player.allocations === 0) {
                teams[teamIndex].players.push(player.name);
                teams[teamIndex].team_strength += player[itemArray];
                player.team = teams[teamIndex].name;
                player.allocations++;
                teamStrengths[teamIndex] += player[itemArray];
                teamIndex = (teamIndex + 1) % teams.length;
                player.includedRatings.push(player[itemArray]);
            } else if (player.allocations === 1) {
                teams[teamIndex].team_strength += player[itemArray];
                player.includedRatings.push(player[itemArray]);
                player.allocations++;
                teamIndex = (teamIndex + 1) % teams.length;
            } else if (player.allocations === 2) {
                const minIncludedRating = Math.min(...player.includedRatings);
                if (player[itemArray] > minIncludedRating) {
                    const indexToReplace = player.includedRatings.indexOf(minIncludedRating);
                    player.includedRatings[indexToReplace] = player[itemArray];
                    teamStrengths[teamIndex] += player[itemArray] - minIncludedRating;
                }
                player.allocations++;
                teamIndex = (teamIndex + 1) % teams.length;
            }
            else{
              break;
            }
        }
    }
    return teams;
},

  handlePlayerAllocation: function handlePlayerAllocation(
    player,
    currentRating,
    team,
    teams
  ) {
    if (player.allocations === 0) {
      team["players"].push(player);
      team.team_strength += currentRating;
      player.allocations++;
      player.mappedTeam = team.name;
      player.includedRatings.push(currentRating);
    } else if (player.allocations === 1) {
      const existing_Team = teams.filter((x) => x.name == player.mappedTeam);
      existing_Team.team_strength += currentRating;
      player.includedRatings.push(currentRating);
    } else if (player.allocations >= 2) {
      const lowestRating = Math.min(...player.includedRatings);
      if (currentRating > lowestRating) {
        const indexToReplace = player.includedRatings.indexOf(lowestRating);
        player.includedRatings[indexToReplace] = currentRating;
        team.team_strength += currentRating - lowestRating; // Adjust team strength with new rating
      }
    }
  },

  addGroupEventRatings: function addGroupEventRatings(
    teams,
    players,
    groupEvents
  ) {
    for (const team of teams) {
      let teamStrengthGroupEvents = 0;
      for (const playerName of team["players"]) {
        const player = players.find((p) => p.name === playerName);
        if (player) {
          for (const groupEvent of groupEvents) {
            teamStrengthGroupEvents += player[groupEvent] || 0;
          }
        }
      }

      team.team_strength += teamStrengthGroupEvents;
    }
    return teams;
  },
};
