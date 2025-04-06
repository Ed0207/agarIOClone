const Settings = require('./settings').Settings;
// Player Data for other players

class PlayerData{
    constructor(playerName ){
        this.name = playerName;
        this.x = Math.floor(Settings.WORLDWIDTH* Math.random() + 10);
        this.y = Math.floor(Settings.WORLDHEIGHT* Math.random() + 10);
        this.radius = Settings.DEFAULTSIZE;
        this.color = getRandomColor();
        this.score = 0;
        this.orbsAbsorbed = 0;
        this.playersAbsorbed = 0;
    }
}

const getRandomColor = () =>{

    const r = Math.floor((Math.random() * 200) + 50);
    const g = Math.floor((Math.random() * 200) + 50);
    const b = Math.floor((Math.random() * 200) + 50);

    return `rgb(${r}, ${g}, ${b})`;
}
module.exports = PlayerData;