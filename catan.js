// Main Menu
import { drawHexagon, randomRange, rotate } from "./Utils.js";

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
const forget = drawHexagon(context, 0, 0, canvas.width / 1.8);

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

    const graph = [];
    
    for (let i = 0; i < totalHex; i++){
        
        if (i - a == r) {
            a += r;
            b++;
        }
    
        r = longestRow - Math.abs(shortestRow - 1 - b % longestRow);
    
        const x = (i - a) * w * 0.87 + (w * (longestRow - r) * 0.45) + w * 0.75; 
        const y = b * h * 0.75 + margin * 3 + h/2;
    
        context.fillStyle = terranTypes[randomRange(0,terranTypes.length + 1)];
        
        context.save();
        const corners = drawHexagon(context, x, y, w/2);
        context.restore();
        //context.fill();
        
        corners[0].forEach((c)=>{
            context.save();
            //console.log(c, x, y);
            c = rotate(c.x, c.y, 0, 0, 90);
            const circle = new Path2D();
            circle.arc(c.x + x, c.y + y, 6, 0, 2 * Math.PI);
            //context.stroke(circle);
            
            if (graph.length < 1){
                graph.push({x: c.x + x, y: c.y + y, circle: circle});
            } 
            
            let flag = true;
            for (let j = 0; j < graph.length; j++){
                if(context.isPointInPath(graph[j].circle, c.x + x, c.y + y )) {
                    console.log(c);
                    flag = false;
                }
            }
            if (flag){
                graph.push({x: c.x + x, y: c.y + y, circle: circle});
            }
            context.restore();

        }); 
        
        corners[1].forEach((c)=>{
            context.save();
            //console.log(c, x, y);
            c = rotate(c.x, c.y, 0, 0, 90);
            const circle = new Path2D();
            circle.arc(c.x + x, c.y + y, 6, 0, 2 * Math.PI);
            context.stroke(circle);
        })
    }

    //additional loop to draw cicles on top of hexagones
    for (let j = 0; j < graph.length;j++){
        context.stroke(graph[j].circle);
    }

    console.log(graph);
    return graph;
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
        if(this.hand.resources.includes(item.price)) {
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




