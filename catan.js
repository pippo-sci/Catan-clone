// Main Menu
import { drawHexagon, randomRange } from "./Utils.js";

const score = document.getElementById("score");
score.innerHTML = "0";
const newGame = document.getElementById("newGame");

newGame.addEventListener("click", () => {
    const game = new Game();
})

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


const createBoard = () => {
    
    const margin = 20;
    const w = (canvas.width) / 5;
    const h = (canvas.height) / 5;
    
    const terranTypes = ['brown','darkGreen','gray','red','yellow','LimeGreen','beige']
    
    let r;
    let a = 0;
    let b = 0;
    const longestRow = 5;
    const shortestRow = 3;
    const totalHex = 19;
    
    for (let i = 0; i < totalHex; i++){
        
        if (i - a == r) {
            a += r;
            b++;
        }
    
        r = longestRow - Math.abs(shortestRow - 1 - b % longestRow);
    
        const x = (i - a) * w + (w * (longestRow - r) * 0.45); 
        const y = b * h * 0.75 + margin * 3;
    
        context.fillStyle = terranTypes[randomRange(0,terranTypes.length + 1)];
        
        context.save();
        drawHexagon(context, x + w/2, y + w/2, w/2);
        //context.rect(x, y, w, h);
        context.stroke();
        context.restore();
    }
}

// Game classes

class Game {
    constructor (playerList) {
        this.playersList = playerList;
        this.board = createBoard();
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

    constructor(type) {
        super(null);
        this.type = type;
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




