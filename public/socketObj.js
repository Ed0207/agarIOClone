// connect to the socket server
console.log("socket obj");
const connectionURL = 'https://agarioclone.onrender.com/';
const socket = io.connect(connectionURL);


const init = async ()=>{
    console.log("sending init...")
    // emitWithAck will wait for server response
    const initData = await socket.emitWithAck('init', {
        playerName : player.name,
    });

    console.log("init data", initData);

    setInterval(async ()=>{
        // track server
        const loc = await socket.emit('tock',{
            xVector : player.xVector ? player.xVector : .1,
            yVector : player.yVector ? player.yVector : .1,
        })

    }, 33)
    orbs = initData.orbs;
    player.indexInPlayers = initData.indexInPlayers;

    draw(); 
}

socket.on('tick', (playersArray) =>{
    // console.log("tick ", playersArray, player.indexInPlayers, playersArray[player.indexInPlayers])
    players = playersArray;
    if(players[player.indexInPlayers].playerData){
        player.x = playersArray[player.indexInPlayers].playerData.x;
        player.y = playersArray[player.indexInPlayers].playerData.y;
    }
})

socket.on('orbUpdate', (orbData)=>{
    // console.log("orb update!")
    orbs.splice(orbData.capturedOrbIndex, 1, orbData.newOrb);
})

socket.on('playerUpdate', (absorbData)=>{

    console.log("abosrtion", absorbData);
    document.querySelector('#game-message').innerHTML = `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy}`
    document.querySelector('#game-message').style.opacity = 1;

    // pvp message
    window.setTimeout(()=>{
        document.querySelector('#game-message').style.opacity = 0;
    }, 2000)
})

socket.on('updateLeaderBoard', leaderBoard =>{
    
    leaderBoard.sort((a,b) =>{
        return b.score - a.score;
    })
    document.querySelector('.leader-board').innerHTML = "";
    leaderBoard.forEach(p=>{
        if(p.name !== null){
            document.querySelector('.leader-board').innerHTML +=
            `
                <li class="leaderboard-player">${p.name} - ${p.score}</li>
            `
        }
    })
})