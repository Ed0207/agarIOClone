const canvas = document.querySelector('#the-canvas');
const context = canvas.getContext('2d');

canvas.height = window.outerHeight;
canvas.width = window.outerWidth;

// initialize objects
const player = {};
let players = [];
let orbs = [];
    
const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));

window.addEventListener('load', ()=>{
    loginModal.show();
})

document.querySelector('.name-form').addEventListener('submit', (e) =>{
    e.preventDefault();
    player.name = document.querySelector('#name-input').value;
    document.querySelector('.player-name').innerHTML = player.name;

    // open up prompt next prompt
    loginModal.hide();
    spawnModal.show();
    console.log('guest player ' + player.name + ' has joined');
})


document.querySelector('.start-game').addEventListener('click', (e) =>{

    spawnModal.hide();

    const onStart = Array.from(document.querySelectorAll('.hiddenOnStart'));
    onStart.forEach(x => x.removeAttribute('hidden'));
    console.log("start game")
    init();
})