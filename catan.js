const randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const drawHexagon = (ctx, x, y, r) => {

    const a = 2 * Math.PI / 6;
    ctx.save()
    ctx.translate(x, y);
    ctx.rotate(90 / 180 * Math.PI);
    ctx.beginPath();
    for (let i= 0; i < 6; i++){
        
        ctx.lineTo(r * Math.cos(a * i), r * Math.sin(a * i));
    }
    ctx.fill();
    //ctx.stroke();
    ctx.restore();
}

const canvas = document.getElementsByTagName("canvas")[0];

canvas.width = 600;
canvas.height = 600;
const context = canvas.getContext("2d");

context.save();
context.fillStyle = 'LightSkyBlue';
context.translate(canvas.width /2, canvas.height /2);
context.rotate(90 / 180 * Math.PI);
//context.fillRect(0, 0, canvas.width, canvas.height);
drawHexagon(context, 0, 0, canvas.width / 1.8);

context.restore();

const margin = 20;
const w = (canvas.width) / 5;
const h = (canvas.height) / 5;


const terranTypes = ['brown','darkGreen','gray','red','yellow','LimeGreen','beige']



let r;
let a = 0;
let b = 0;
const longestRow = 5;

for (let i = 0; i < 19; i++){
    
    if (i - a == r) {
        a += r;
        b++;
    }

    r = longestRow - Math.abs(2 - b % longestRow);

    const x = (i - a) * w + (w * (longestRow - r) * 0.5); 
    const y = b * h * 0.75 + margin * 3;

    context.fillStyle = terranTypes[randomRange(0,terranTypes.length)];
    
    context.save();
    drawHexagon(context, x + w/2, y + w/2, w/2);
    //context.rect(x, y, w, h);
    context.stroke();
    context.restore();
}


//for (let i = 0; i > -10; i--) {console.log(i % 5);}

class Game {
    constructor (playerList, board) {
        this.playersList = playerList;
        this.board = board;
    }

    start() {

        let i = 0;

        while (true) {
            const currentPlayer = this.playerList[i % this.playerList.length];
            currentPlayer.turn();
            i++;
            if (currentPlayer.score >= 10){
                break;
            }
        }

    }
}



class Player {
    constructor (name) {
        this.score = 0;
        this.name = name;
        this.hand = {resources: [],
                    build: [],
                    development: [],
                    knights: []};
    }

    turn(){
        this.rollDices();
    }

    rollDices() {
        return randomRange(1,7);
    }

    buy(item) {
        if(item.price in this.hand.resources) {
            this.hand[item.type] = item;
        } else {
            alert("Not enough resources");
        }
    }

    exchange() {

    }

    moveBandid(){

    }

    useDevelopment(){

    }
    
}

class humanPlayer extends Player {
    constructor(){
        super();
    }
}

class AIPlayer extends Player {
    constructor() {
        super();
    }
}

class Item {
    constructor (price, type) {
        this.price = price;
        this.type = type;
    }
}

class Settle extends Item {
    constructor(price){
        super(price, "");
    }
}

class City extends Item {
    constructor(price){
        super(price);
    }
}

class Road extends Item {
    constructor(price){
        super(price);
    }
}

class Card extends Item {
    constructor (price) {
        super(price);
    }
}

class ResourceCard extends Card {

    constructor() {
        super(null);
    }
}

class DevelopmentCard extends Card {

    constructor() {
        super(price);
    }
}

class Board {

    constructor () {
        this.grid = {

        }

    }

}




