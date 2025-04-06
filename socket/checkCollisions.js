const checkForOrbCollisions = (pData,pConfig, orbs, settings)=>{

    // console.log("checking orb collision");
    // console.log(pData);
    // console.log(pConfig);

    //ORB COLLISIONS
    for (let i = 0; i < orbs.length; i++){
        const orb = orbs[i];
        // console.log(orb);

        //  check collision using square first 
        if(pData.x + pData.radius + orb.radius > orb.x
            && pData.x < orb.x + pData.radius + orb.radius
            && pData.y + pData.radius + orb.radius > orb.y
            && pData.y < orb.y + pData.radius + orb.radius){
        // Pythagoras test(circle)
            distance = Math.sqrt(
                ((pData.x - orb.x ) * (pData.x - orb.x )) + 
                ((pData.y - orb.y ) * (pData.y - orb.y))	
                );
            if(distance < pData.radius + orb.radius){
                // if the distance between their centers are shorter than the sum of their radius, the collision had taken place
                pData.score += 1; 
                pData.orbsAbsorbed += 1; 
                // pData.color = orb.color;
                if(pConfig.zoom > 1){
                    pConfig.zoom -= .001; //update zoom so player doesn't get to big for screen
                }
                pData.radius += 0.05; 
                if(pConfig.speed < -0.005){
                    pConfig.speed += 0.005; //increase player speed
                }else if(pConfig.speed > 0.005){
                    pConfig.speed -= 0.005;
                }
                // can't hit more than one orb on a tock so stop
                return i;
            }
        }
    };
    return null
}
        
const checkForPlayerCollisions = (pData,pConfig,players,playersForUsers,playerId)=>{


    //PLAYER COLLISIONS	
    for(let i = 0; i<players.length; i++){
        const p = players[i];

        if(p.socketId && p.socketId != playerId){ 
            //Added p.socketId test in case player has been removed from players
            let pLocx = p.playerData.x
            let pLocy = p.playerData.y
            let pR = p.playerData.radius
            // checking if player outter squares have contacted
            if(pData.x + pData.radius + pR > pLocx
            && pData.x < pLocx + pData.radius + pR
            && pData.y + pData.radius + pR > pLocy 
            && pData.y < pLocy + pData.radius + pR){
                // console.log("Hit square test!");
        // Pythagoras test
                distance = Math.sqrt(
                    ((pData.x - pLocx) * (pData.x - pLocx)) + 
                    ((pData.y - pLocy) * (pData.y - pLocy))	
                    );      
                if(distance < pData.radius + pR){
            //COLLISION!!
                    if(pData.radius > pR){
                // ENEMY DEATH
                        pData.score += (p.playerData.score + 10);
                        pData.playersAbsorbed += 1;
                        p.alive = false;
                        pData.radius += p.playerData.radius * 0.25
                        const collisionData = {
                            absorbed: p.playerData.name,
                            absorbedBy: pData.name,
                        }

                        if(pConfig.zoom > 1){
                            pConfig.zoom -= (pR * 0.25) * .001;
                        }
                        console.log("players", players);
                        players.splice(i, 1,{}); //remove player from server players array
                        playersForUsers.splice(i,1,{}) //remove player from players array used by clients

                        
                        return collisionData; //essentially a return statement (because I could't get it work without a promise?)
                    }
                }
            }
        }
    }
    return null;
}

module.exports = {checkForOrbCollisions, checkForPlayerCollisions};