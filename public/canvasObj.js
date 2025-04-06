let speed = 10;
player.x = Math.floor(500 * Math.random() + 10);
player.y = Math.floor(500 * Math.random() + 10);

const getRandomColor = () =>{

    const r = Math.floor((Math.random() * 200) + 50);
    const g = Math.floor((Math.random() * 200) + 50);
    const b = Math.floor((Math.random() * 200) + 50);

    return `rgb(${r}, ${g}, ${b})`;
}

player.color = getRandomColor();

const draw = ()=>{
    
    // console.log("drawing..");
    // reset value
    // transform then clear canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // set viewport to center
    const camX = -player.x + canvas.width/2;
    const camY = -player.y + canvas.height/2;
    // move the canvas to the position of the player
    context.translate(camX,camY);

    players.forEach( p=>{

        // skip P if p is absorbed (replaced by empty data set)
        if(!p.playerData){
            return;
        }
        // console.log("drawing player " + p.name);
        // draw player circle
        p = p.playerData;
        // console.log("draw player ", p);
        context.beginPath();
        context.fillStyle = p.color;
        context.arc(p.x , p.y , p.radius, 0, Math.PI * 2);
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = 'rgb(0,255,0)';
        context.stroke();
    })

    // draw orbs
    orbs.forEach(orb =>{
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.x, orb.y, orb.radius, 0, Math.PI*2);
        context.fill();
    })
    context.stroke();

    // recursive call for animation
    requestAnimationFrame(draw);
}


// moust listener for player mouse movement
canvas.addEventListener('mousemove', (e)=>{

    const mousePosition = {
        x: e.clientX,
        y: e.clientY
    };

    // arc tangent of player
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;

    if(angleDeg >= 0 && angleDeg < 90){
        xV = 1 - (angleDeg/90);
        yV = -(angleDeg/90);
    }else if(angleDeg >= 90 && angleDeg <= 180){
        xV = -(angleDeg-90)/90;
        yV = -(1 - ((angleDeg-90)/90));
    }else if(angleDeg >= -180 && angleDeg < -90){
        xV = (angleDeg+90)/90;
        yV = (1 + ((angleDeg+90)/90));
    }else if(angleDeg < 0 && angleDeg >= -90){
        xV = (angleDeg+90)/90;
        yV = (1 - ((angleDeg+90)/90));
    }

    player.xVector = xV;
    player.yVector = yV;

    // console.log("player on move", player);

})
