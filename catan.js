// Main Menu
import { drawHexagon, randomRange, rotate, polyInNotList, mod } from "./Utils.js";

const name = document.getElementById("name").lastChild;
const score = document.getElementById("score").lastChild;
const hand = document.getElementById("hand").lastChild;
const dices = document.getElementById("dices");

name.innerHTML = "No player";
score.innerHTML = "0";
hand.innerHTML = ".";

const newGame = document.getElementById("newGame");
const canvas = document.getElementsByTagName("canvas")[0];
const rollDice = document.getElementById("rollDice");

canvas.width = 600;
canvas.height = 600;

const context = canvas.getContext("2d");

context.save();
context.strokeStyle = 'gray';
context.fillStyle = 'LightSkyBlue';
context.translate(canvas.width /2, canvas.height /2);
context.rotate(90 / 180 * Math.PI);
const forget = drawHexagon(context, 0, 0, canvas.width / 2);

let game;

newGame.addEventListener("click", () => {
    const playerList = [];
    for (let i = 0; i < 4;i++){
        playerList.push(new Player(`Player ${i + 1}`));
    }
    
    game = new Game(playerList);
    rollDice.style.display = "inline";

    //game.start();

})

rollDice.addEventListener("click", () => {
    const dice1 = randomRange(1,7);
    const dice2 = randomRange(1,7);
    dices.innerHTML = `dices: ${dice1} + ${dice2} =  ${dice1+dice2}`;
})

canvas.addEventListener("click", event => {
    if (typeof game !== 'undefined'){
        for(let i of game.board[0] ){
            if(i.type != "hexagon"){
                if (context.isPointInPath(i.shape, event.offsetX, event.offsetY)){
                    context.fillStyle = 'red';
                    context.fill(i.shape);
                } else {
                    context.fillStyle = 'white';//'rgba(255, 255, 255, 0.01)';
                    context.fill(i.shape);
                    context.stroke(i.shape);
                }
            }

        }
    }
});

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

    const graph = [[],[]]; 
    const types = ["settleSlot", "roadSlot"];
    
    for (let i = 0; i < totalHex; i++){
        
        if (i - a == r) {
            a += r;
            b++;
        }
    
        r = longestRow - Math.abs(shortestRow - 1 - b % longestRow);
    
        const x = (i - a) * w * 0.87 + (w * (longestRow - r) * 0.43) + w * 0.75; 
        const y = b * h * 0.75 + margin * 3 + h/2;
    
        context.fillStyle = terranTypes[randomRange(0,terranTypes.length + 1)];
        
        context.save();
        const borders = drawHexagon(context, x, y, w/2);
        context.restore();
        //context.fill();
        
        borders.forEach((corner, index) => {

            let neighIndex = [];

            corner.forEach((c) => {
                context.save();
                c = rotate(c.x, c.y, 0, 0, 90);
                const circle = new Path2D();
                const centreX = c.x + x;
                const centreY = c.y + y;
                circle.arc(centreX, centreY, 6, 0, 2 * Math.PI);
                
                if (graph[index].length < 1){
                    graph[index].push({x: centreX, y: centreY, shape: circle, type: types[index], neigh:[]});
                    neighIndex.push(graph[index].length - 1);
                } else {
                    const match = polyInNotList(context, graph[index], centreX,centreY);
                    if (match[0]) {
                        graph[index].push({x: centreX, y: centreY, shape: circle, type: types[index], neigh:[]}); 
                        neighIndex.push(graph[index].length - 1);
                    } else {
                        //console.log(match[1]);
                        neighIndex = neighIndex.concat(match[1]);
                    }
                }

                context.restore();
                
            });
                        
            //console.log(neighIndex);
            graph[index].push({x: x, y: y, type: "hexagon", resource: context.fillStyle, neigh: neighIndex})
        }); 
    }
    console.log(graph);

    //additional loop to draw cicles on top of hexagones
    for (let j = 0; j < graph[0].length;j++){
        if (graph[0][j].type == "settleSlot"){
            context.strokeStyle = 'gray';
            context.stroke(graph[0][j].shape);
            
        } else {
            
            graph[0][j].neigh.forEach((k, index) =>{
                graph[0][k].neigh.push(j); //add hexagon
                const prev = graph[0][j].neigh[mod(index - 1, 6)];
                const next = graph[0][j].neigh[mod(index + 1, 6)];
                if (!graph[0][k].neigh.includes(prev)){
                    graph[0][k].neigh.push(prev); //add prev neigh
                }
                if (!graph[0][k].neigh.includes(next))
                graph[0][k].neigh.push(next); //add next neigh
                
            });
        }
        
    }

    return graph;
}


// Game classes

class Game {

    constructor (playersList) {
        this.playersList = playersList;
        this.board = createBoard();
    }

    start() {

        let i = 0;
        let currentPlayer;
        while (true) {
            currentPlayer = this.playersList[i % this.playersList.length];
            name.innerHTML = currentPlayer.name;
            score.innerHTML = currentPlayer.score;
            hand.innerHTML = currentPlayer.hand;
            currentPlayer.turn();
            i++;
            if (currentPlayer.score >= 10){
                break;
            }
        }
        alert(`player ${currentPlayer.name} won`);

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

    turn(game){
        //this.rollDices();
        alert("pick a card");
        alert("roll dice");

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




