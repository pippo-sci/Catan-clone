// Main Menu
import { drawHexagon, randomRange, rotate, polyNotInList, mod, rotatedRect } from "./Utils.js";

const name = document.getElementById("name").lastChild;
const score = document.getElementById("score").lastChild;
const hand = document.getElementById("hand").lastChild;
const dices = document.getElementById("dices");

name.innerHTML = "No player";
score.innerHTML = "0";
hand.innerHTML = "None";

const newGame = document.getElementById("newGame");
const rollDice = document.getElementById("rollDice");
const endTurn = document.getElementById("endTurn");
const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 600;
canvas.height = 600;
const context = canvas.getContext("2d");

context.save();
context.strokeStyle = 'gray';
context.fillStyle = 'LightSkyBlue';
context.translate(canvas.width /2, canvas.height /2);
context.rotate(90 / 180 * Math.PI);
const __ = drawHexagon(context, 0, 0, canvas.width / 2);
context.restore();

let game;
let currentSlot;

canvas.addEventListener("click", event => {
    if (typeof game !== 'undefined'){
        game.board['roadSlot'].forEach((settle, index) => {
            context.save();
            context.strokeStyle = 'gray';
            if (context.isPointInPath(settle.shape, event.offsetX, event.offsetY)){
                context.fillStyle = 'red';
                context.fill(settle.shape);
                currentSlot = index;
                hand.innerHTML = `${currentSlot} - ${event.offsetX}, ${event.offsetY}`;
                
                for (let n of settle.neigh.settleSlot) {
                    context.save();
                    context.fillStyle = "green";
                    context.fill(game.board['settleSlot'][n].shape)
                    context.restore();
                }
            } else {
                context.fillStyle = typeof settle['settleColor'] != 'undefined'? settle.settleColor: "white";
                context.fill(settle.shape);
                context.stroke(settle.shape);
            }
            context.restore();
            
        })
    }
});



rollDice.addEventListener("click", () => {
    if(!game.dicesRolled){
        const dice1 = randomRange(1,7);
        const dice2 = randomRange(1,7);
        dices.innerHTML = ` ${dice1} + ${dice2} =  ${dice1+dice2}`;
        game.dicesValue = dice1+dice2;
        game.dicesRolled = true;
        rollDice.disabled = true;
        endTurn.disabled = false;
        game.reward();
    } else {
        alert("Dices already rolled");
    }
})

endTurn.addEventListener("click", () => {
    if (game.dicesRolled){
        game.turn += 1;
        game.dicesRolled = false;
        game.nextTurn();
        rollDice.disabled = false;
        endTurn.disabled = true;
    } else {
        alert("roll dices first");
    }
    
})

newGame.addEventListener("click", () => {

    const colors = ["darkBlue", "orange", "darkRed", "gray"]
    const playerList = [];
    for (let i = 0; i < 4;i++){
        playerList.push(new Player(`Player ${colors[i]}${i + 1}`, colors[i]));
    }
    
    game = new Game(playerList);
    game.randomInit();
    rollDice.style.display = "inline";
    endTurn.style.display = "inline";
    endTurn.disabled = true;
    
    game.nextTurn();
})


const createBoard = () => {
    
    const margin = 20;
    const w = (canvas.width) / 5;
    const h = (canvas.height) / 5;
    
    const terranTypes = ['brown','darkGreen','lightBlue','red','yellow','LimeGreen','beige']
    
    let r;
    let a = 0;
    let b = 0;
    const longestRow = 5;
    const shortestRow = 3;
    const totalHex = 19;

    const graph = {
        hexagon: [],
        settleSlot: [],
        roadSlot: []
    }; 
    const types = ["settleSlot", "roadSlot", "hexagon"];
    
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
        const number = randomRange(1,7)+randomRange(1,7);
        context.font = "30px Arial";
        context.fillStyle = 'black';
        context.fillText(number, x-10, y+10);
        context.restore();
       
        graph['hexagon'].push({x: x, y: y, number: number, resources: context.fillStyle, neigh: {settleSlot: [], roadSlot: []}});           
        
        borders.forEach((corner, index) => {
            
            let levelType = types[index]; // settle or road
            let neighIndex = [];

            corner.forEach((c, ii) => {
                context.save();
                let circle = new Path2D();
                let centreX, centreY;
                if (index == 0){
                    c = rotate(c.x, c.y, 0, 0, 90);
                    centreX = c.x + x;
                    centreY = c.y + y;
                    circle.arc(centreX, centreY, 6, 0, 2 * Math.PI);
                } else {
                    const empty = new Path2D();
                    c = rotate(c.x, c.y, x, y, 90);
                    centreX = c.x + x; centreY = c.y + y;
                    //empty.rect(0,0,1,1);
                    context.save();
                    context.translate(x, y);
                    context.rotate( (60 * ii) / 180 * Math.PI);
                    context.rotate( 90 / 180 * Math.PI);
                    const m = context.getTransform();
                    empty.rect(-24, 49, w/2.5, 6);
                    context.restore();
                    circle.addPath(empty, m);
                    console.log(c);
                    
                }
                
                
                if (graph[levelType].length < 1){
                    const slot = new Slot(centreX, centreY, circle, levelType);
                    graph[levelType].push(slot);
                    neighIndex.push(graph[levelType].length - 1);
                } else {
                    const match = polyNotInList(context, graph[levelType], centreX, centreY);
                    if (match[0]) {
                        const slot = new Slot(centreX, centreY, circle, levelType);
                        graph[levelType].push(slot); 
                        neighIndex.push(graph[levelType].length - 1);
                    } else {
                        //console.log(match[1]);
                        neighIndex = neighIndex.concat(match[1]);
                    }
                }

                context.restore();
      
            });
            graph.hexagon[i].neigh[levelType] = neighIndex;

            
        });

    }
    console.log(graph);

    //additional loop to draw cicles on top of hexagones
    for (let j = 0; j < graph.settleSlot.length;j++){
        context.save();
        context.fillStyle = 'white';
        context.strokeStyle = 'gray';
        context.fill(graph.settleSlot[j].shape);
        context.stroke(graph.settleSlot[j].shape);
        context.restore();    
    }

    for (let j = 0; j < graph.roadSlot.length; j++){
        context.save();
        context.fillStyle = 'white';
        context.strokeStyle = 'gray';
        //context.translate(graph.roadSlot[j].x, graph.roadSlot[j].y);
        //context.rotate(45 / 180 * Math.PI);
        context.fill(graph.roadSlot[j].shape);
        context.stroke(graph.roadSlot[j].shape);
        context.restore();
    }

    // Populate reciprocity networks: hexagon - settle
    for (let j = 0; j < graph.hexagon.length;j++){
        graph.hexagon[j].neigh.settleSlot.forEach((k, index) =>{
            graph.settleSlot[k].neigh['hexagon'].push(j); //add hexagon
            const prev = graph['hexagon'][j].neigh.settleSlot[mod(index - 1, 6)];
            const next = graph['hexagon'][j].neigh.settleSlot[mod(index + 1, 6)];
            if (!graph['settleSlot'][k].neigh.settleSlot.includes(prev)){
                graph['settleSlot'][k].neigh.settleSlot.push(prev); //add prev neigh
            }
            if (!graph['settleSlot'][k].neigh.settleSlot.includes(next)){
                graph['settleSlot'][k].neigh.settleSlot.push(next); //add next neigh
            }
            
        });
    }
    return graph;
}


// Game classes


class Game {
    
    constructor (playersList) {
        this.playersList = playersList;
        this.board = createBoard();
        this.turn = 0;
        this.dicesValue;
        this.dicesRolled = false;

    }

    isValidLocation(location) {
        for (let n of location.neigh.settleSlot){
            //console.log(typeof this.board[0][n]['settleColor'] != 'undefined');
            if (typeof this.board['settleSlot'][n]['settleColor'] != 'undefined'){
                return false;
            }
        }
        return true;
    }

    randomInit(){

        for(let player of this.playersList){
            let tries = true;
            while(tries){
                const randomIndex = randomRange(0, this.board['settleSlot'].length);

                if (this.isValidLocation(this.board['settleSlot'][randomIndex])){
                    this.board['settleSlot'][randomIndex]['settleColor'] = player.color;
                    context.save();
                    context.fillStyle = player.color;
                    context.strokeStyle = 'gray';
                    context.fill(this.board['settleSlot'][randomIndex].shape);
                    context.stroke(this.board['settleSlot'][randomIndex].shape);
                    context.restore();
                    tries = false;
                };
            }


        }
    }

    nextTurn() {

        let currentPlayer;
        
        currentPlayer = this.playersList[this.turn % this.playersList.length];

        name.innerHTML = currentPlayer.name;
        score.innerHTML = currentPlayer.score;
        hand.innerHTML = `${currentPlayer.hand.resources}`;
        //currentPlayer.turn();
        if (currentPlayer.score >= 10){
            alert(`${currentPlayer.name} won`);
        }
        
    }

    reward(){
        for (let h of this.board.hexagon){
            if (h.number == this.dicesValue){
                for(let s of h.neigh.settleSlot) {
                    for (let p of this.playersList){
                        if (p.color == this.board.settleSlot[s].settleColor){
                            p.hand.resources.push(h.resources);
                        }
                    }
                }
            }
        }
    }
}



class Player {
    constructor (name, color) {
        this.color = color;
        this.score = 0;
        this.name = name;
        this.hand = {resources: [],
                    build: [],
                    development: [],
                    knights: []};
    }

    turn(game){
        
        //alert("pick a card");
        //alert("roll dice");
        this.score += 1;

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

class Slot {

    constructor (x, y, shape, type) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.shape = shape;
        this.neigh = {settleSlot: [],
                      roadSlot: [],
                      hexagon: []
        } 

    }

}




