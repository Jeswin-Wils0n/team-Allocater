const TeamFunctions = require("../Services/functions");
const { appLogger, meteredLogger } = require("../logger/logger");

module.exports = (server) => {
  server.post("/teamGeneration", async (req, res) => {
    // startDateTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    appLogger.info("teamGeneration API -started", {
      filename: __filename,
      functionname: "teamGeneration",
    });
    const startTime = new Date();
    try {
      let data;
      const files = req.files; 
      if (files && files.player_ratings) {
        const filePath = files.player_ratings.path;
        data= TeamFunctions.parseExcelFile(filePath);
      } else {
        res.send(400, 'No file uploaded');
      }

      const body = req.body;
      const playersdetails = data.players;
      const numTeams = data.numTeams;
      const teamNames = data.teamNames;
      const groupEvents = data.groupEvents;
      const individualItems = data.individualEvents;
      const resultTeams = TeamFunctions.createTeams( playersdetails, individualItems, groupEvents, numTeams, teamNames );

      res.send(resultTeams);

      appLogger.info("teamGeneration completed", {
        filename: __filename,
        functionname: "teamGeneration",
      });
      const endTime = new Date();
      const duration = endTime - startTime;
      meteredLogger.info("teamGeneration metered log", {
        filename: __filename,
        functionname: "teamGeneration",
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
        duration,
      });
    } catch (e) {
      appLogger.error("teamGeneration- Error generating teams:", e); //logging the error
      const endTime = new Date();
      const duration = endTime - startTime;
      meteredLogger.error("teamGeneration metered log (error)", {
        filename: __filename,
        functionname: "teamGeneration",
        startDate: startTime,
        endDate: endTime,
        duration,
        error: e,
      });
      res.json({ type: "Failure", message: e, statusCode: 500 });
    }
  });
};
