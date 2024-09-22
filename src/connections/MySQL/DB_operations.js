const {connection} = require('./connection');

module.exports={
   addPlayer: 'INSERT INTO sports.sports_ratings (EMPLOYEE_NAME, CAROMS, TABLE_TENNIS, CHESS, JENGA, FOUZ_BALL, DARTING, SACK_RACE,LEMON_SPOON,BADMINTON,PENALTY_KICK,BALL_OUT,FOOTBALL,CRICKET,SOAP_FOOTBALL,DODGE_BALL,THUG_OF_WAR)'+
   ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
};

