const PlayerConfig = require('./class/playerConfig');
const PlayerData = require('./class/playerData');
const Player = require('./class/player');
const Settings = require('./class/settings').Settings;
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;
// entry point for all socket obj

const io = require('../servers').io;
const app = require('../servers').app;
const Orb = require('./class/orb');

// create orb ojects for players to absorb
// for every orb absorbed, a new one is created
const orbs = [];
const players = [];
const playersForUsers = [];
let tickTockInterval



io.on('connect', (socket)=>{

    let player = {};

    //runs when a player connects 
    socket.on('init', (playerObj, ackCallback)=>{
        console.log("connection established")

        // when first player join the lobby, starts ticking
        if(players.length === 0){
            generateOrbs();
            tickTockInterval = setInterval(()=>{
                // sent event to the 'game' room
                io.to('game').emit('tick', playersForUsers)
            }, 33) 
            // average of 30 fps
        }

        socket.join('game');

        const playerName = playerObj.playerName;
        const playerConfig = new PlayerConfig();
        const playerData = new PlayerData(playerName);
        player = new Player(socket.id, playerConfig, playerData);

        players.push(player);
        playersForUsers.push({playerData});

        ackCallback({orbs,indexInPlayers:playersForUsers.length-1});
    });


    // server side player data calculation
    socket.on('tock', (data)=>{

        if(!player.playerConfig){
            return;
        }

        // movement calculation
        speed = player.playerConfig.speed;
        const xV = player.playerConfig.xVector = data.xVector;
        const yV = player.playerConfig.yVector = data.yVector;

        if((player.playerData.x > 5 && xV < 0) || (player.playerData.x < Settings.WORLDWIDTH) && (xV > 0)){
            player.playerData.x += speed * xV;
        }
        if((player.playerData.y > 5 && yV > 0) || (player.playerData.y < Settings.WORLDHEIGHT) && (yV < 0)){
            player.playerData.y -= speed * yV;
        }


        // collision check
        const capturedOrbIndex = checkForOrbCollisions(player.playerData, player.playerConfig, orbs);
        if(capturedOrbIndex !== null){
            // generate new orb in place of the consumed one
            orbs.splice(capturedOrbIndex, 1, new Orb());
            // update client
            const orbData = {
                capturedOrbIndex,
                newOrb : orbs[capturedOrbIndex]
            }

            io.to('game').emit('orbUpdate', orbData);
            io.to('game').emit('updateLeaderBoard', getLeaderBoard());
        }

        const capturedPlayerData = checkForPlayerCollisions(player.playerData, player.playerConfig, players, playersForUsers, player.socketId);

        if(capturedPlayerData !== null){
            console.log("player collision data", capturedPlayerData);
            console.log("players ", players);
            console.log("playersForUser ", playersForUsers);
            io.to('game').emit('playerUpdate', capturedPlayerData);
        }

        // console.log("player data on tock", player)
    })

    // check for collision
    
    // stop playing when there's no player left
    socket.on('disconnect', (reason)=>{
        console.log(`player ${player.socketId} disconnected`);
        console.log("cause of disconnection : ", reason);
        
        // find disconnected player, then splice out of players object
        for(let i = 0; i < players.length; i++){
            if(players[i].socketId === player.socketId){
                players.splice(i,1,{});
                playersForUsers.splice(i, 1, {});
            }
        }

        if(players.length === 0){
            clearInterval(tickTockInterval);
            console.log("game stop");
        }
    });
})

function generateOrbs(){
    for(let i = 0; i < Settings.DEFAULTORBS ; i++){
        orbs.push(new Orb());
    }
}


function getLeaderBoard(){
    const leaderBoardArray = players.map(p=>{
        if(p.playerData){
            return{
                name: p.playerData.name,
                score: p.playerData.score
            }
        }else{
            return{

            }
        }
    })
    return leaderBoardArray;
    // console.log("leader board", leaderBoardArray);
}