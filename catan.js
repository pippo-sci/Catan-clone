// Main Menu
import { drawHexagon, randomRange, rotate, polyNotInList, mod, PickWithoutRepeat } from "./Utils.js";

//Colors

const borderColor = "#ffff99";
const lineColor = 'gray';

// Elements

const resources = {'grass':'LimeGreen', 
                   'brick': 'brown', 
                   'wood': 'darkGreen', 
                   'rock':'lightBlue', 
                   'wheat':'yellow'};


// Get elements


const name = document.getElementById("name").lastChild;
const score = document.getElementById("score").lastChild;
const hand = document.getElementById("hand").lastChild;
const dices = document.getElementById("dices");

name.innerHTML = "No player";
score.innerHTML = "0";
hand.innerHTML = "None";

const newGame = document.getElementById("newGame");
const rollDice = document.getElementById("rollDice");
const exchange = document.getElementById("exchange");
const endTurn = document.getElementById("endTurn");
const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 600;
canvas.height = 600;
const context = canvas.getContext("2d");

const basicBoard = () => {
    
    context.save();
    context.strokeStyle = 'gray';
    context.fillStyle = 'LightSkyBlue';
    context.translate(canvas.width /2, canvas.height /2);
    context.rotate(90 / 180 * Math.PI);
    const __ = drawHexagon(context, 0, 0, canvas.width / 2);
    context.restore();
}

basicBoard();

let game;
let currentSlot;

canvas.addEventListener("click", event => {
    if (typeof game !== 'undefined'){
        game.board['roadSlot'].forEach((road, index) => {
            context.save();
            context.strokeStyle = lineColor;
            if (context.isPointInPath(road.shape, event.offsetX, event.offsetY)){
                context.fillStyle = 'red';
                context.fill(road.shape);
                currentSlot = index;
                hand.innerHTML = `${currentSlot} - ${event.offsetX}, ${event.offsetY}`;
            } else {
                context.fillStyle = typeof road['settleColor'] != 'undefined'? road.settleColor: borderColor;
                context.fill(road.shape);
                context.stroke(road.shape);
            }
            context.restore();
            
        })
        game.board['settleSlot'].forEach((settle, index) => {
            context.save();
            context.strokeStyle = lineColor;
            if (context.isPointInPath(settle.shape, event.offsetX, event.offsetY)){
                context.fillStyle = 'red';
                context.fill(settle.shape);
                currentSlot = index;
                hand.innerHTML = `${currentSlot} - ${event.offsetX}, ${event.offsetY}`;
                
            } else {
                context.fillStyle = typeof settle['settleColor'] != 'undefined'? settle.settleColor: borderColor;
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
        exchange.disabled = false;
        endTurn.disabled = false;
        game.reward();
    } else {
        alert("Dices already rolled");
    }
})

exchange.addEventListener('click', () => {
    console.log("exchange");
})

endTurn.addEventListener("click", () => {
    if (game.dicesRolled){
        game.turn += 1;
        game.dicesRolled = false;
        game.nextTurn();
        rollDice.disabled = false;
        exchange.disabled = true;
        endTurn.disabled = true;
    } else {
        alert("roll dices first");
    }
    
})

newGame.addEventListener("click", () => {

    context.clearRect(0, 0, 600, 600);
    basicBoard();

    const playerColors = ["darkBlue", "orange", "red", "gray"]
    const playerList = [];
    for (let i = 0; i < 4;i++){
        playerList.push(new Player(`Player ${playerColors[i]}${i + 1}`, playerColors[i]));
    }
    
    game = new Game(playerList);
    game.randomInit();
    rollDice.style.display = "inline";
    exchange.style.display = 'inline';
    exchange.disabled = true;
    endTurn.style.display = "inline";
    endTurn.disabled = true;
    
    game.nextTurn();
})

/**
 * canvas, context, resources
 * @returns 
 */
const createBoard = () => {
    
    const margin = 20;
    const w = (canvas.width) / 5;
    const h = (canvas.height) / 5;
    
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
    const terranTypes = Object.values(resources);
    terranTypes.push('beige'); //desert color
    
    for (let i = 0; i < totalHex; i++){
        
        if (i - a == r) {
            a += r;
            b++;
        }
    
        r = longestRow - Math.abs(shortestRow - 1 - b % longestRow);
    
        const x = (i - a) * w * 0.87 + (w * (longestRow - r) * 0.43) + w * 0.75; 
        const y = b * h * 0.75 + margin * 3 + h/2;

        const terrain = randomRange(0, terranTypes.length);
        context.fillStyle = terranTypes[terrain];
        
        context.save();
        const radius = w/2;
        const borders = drawHexagon(context, x, y, radius);
        const number = randomRange(1, 7) + randomRange(1, 7);
        context.font = "30px Arial";
        context.fillStyle = 'black';
        context.fillText(number, x - 10, y + 10);
        context.restore();
       
        graph['hexagon'].push({x: x, y: y, number: number, resources: Object.keys(resources)[terrain], neigh: {settleSlot: [], roadSlot: []}});           
        
        borders.forEach((corner, index) => {
            
            let levelType = types[index]; // settle or road
            let neighIndex = [];

            corner.forEach((c, ii) => {
                context.save();
                let circle = new Path2D();
                let centreX, centreY;
                if (index == 0){
                    const cornerRadious = 6;
                    c = rotate(c.x, c.y, 0,0, 60);
                    c = rotate(c.x, c.y, 0, 0, 90);
                    centreX = c.x + x;
                    centreY = c.y + y;
                    
                    circle.arc(centreX, centreY, cornerRadious, 0, 2 * Math.PI);

                } else {
                    const empty = new Path2D();

                    const middleSide = radius/2;
                    const disCentre2Border = Math.sqrt(radius ** 2 - middleSide ** 2);
                    const roadWidth = 6;

                    c = {x: c.x + x, y: c.y + y};
                    c = rotate(c.x, c.y, x, y, 60);
                    c = rotate(c.x, c.y, x, y, 90);
                    centreX = c.x; centreY = c.y;

                    
                    context.save();
                    context.translate(x, y);
                    context.rotate( (60 * ii) / 180 * Math.PI);
                    context.rotate( 90 / 180 * Math.PI);
                    const m = context.getTransform();
                    empty.rect(-middleSide + 6, disCentre2Border - roadWidth/2, middleSide*2 - 8, roadWidth);
                    context.restore();
                    circle.addPath(empty, m);
                    
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
                        neighIndex = neighIndex.concat(match[1]);
                    }
                }

                context.restore();
      
            });
            graph.hexagon[i].neigh[levelType] = neighIndex;

            
        });

    }
    

    //additional loop to draw cicles on top of hexagones
    for (let j = 0; j < graph.roadSlot.length; j++){
        context.save();
        context.fillStyle = borderColor;
        context.strokeStyle = lineColor;
        context.fill(graph.roadSlot[j].shape);
        context.stroke(graph.roadSlot[j].shape);
        context.restore();
    }

    for (let j = 0; j < graph.settleSlot.length;j++){
        context.save();
        context.fillStyle = borderColor;
        context.strokeStyle = lineColor;
        context.fill(graph.settleSlot[j].shape);
        context.stroke(graph.settleSlot[j].shape);
        context.restore();    
    }


    // Populate reciprocity networks: hexagon - settle - road
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

            const prevEdge = graph['hexagon'][j].neigh.roadSlot[mod(index - 1, 6)];
            const nextEdge = graph['hexagon'][j].neigh.roadSlot[mod(index, 6)];
            if (!graph['settleSlot'][k].neigh.roadSlot.includes(prevEdge)){
                graph['settleSlot'][k].neigh.roadSlot.push(prevEdge); //add prev neigh
            }
            if (!graph['settleSlot'][k].neigh.roadSlot.includes(nextEdge)){
                graph['settleSlot'][k].neigh.roadSlot.push(nextEdge); //add next neigh
            }

        });

        graph.hexagon[j].neigh.roadSlot.forEach((k, index) =>{
            graph.roadSlot[k].neigh['hexagon'].push(j); //add hexagon
            
            const prev2 = graph['hexagon'][j].neigh.roadSlot[mod(index - 1, 6)];
            const next2 = graph['hexagon'][j].neigh.roadSlot[mod(index + 1, 6)];
            if (!graph['roadSlot'][k].neigh.roadSlot.includes(prev2)){
                graph['roadSlot'][k].neigh.roadSlot.push(prev2); //add prev neigh
            }
            if (!graph['roadSlot'][k].neigh.roadSlot.includes(next2)){
                graph['roadSlot'][k].neigh.roadSlot.push(next2); //add next neigh
            } 

            const prevSettle = graph['hexagon'][j].neigh.settleSlot[mod(index, 6)];
            const nextSettle = graph['hexagon'][j].neigh.settleSlot[mod(index + 1, 6)];
            if (!graph['roadSlot'][k].neigh.settleSlot.includes(prevSettle)){
                graph['roadSlot'][k].neigh.settleSlot.push(prevSettle); //add prev neigh
            }
            if (!graph['roadSlot'][k].neigh.settleSlot.includes(nextSettle)){
                graph['roadSlot'][k].neigh.settleSlot.push(nextSettle); //add next neigh
            } 
        });

        //complete reciprocal relations
        graph.roadSlot.forEach((road, index)=>{
            //go to neigh and check if he is present
            for (let i of road.neigh.settleSlot){
                for (let j of graph.settleSlot[i].neigh.roadSlot){
                    if (j!=index && !road.neigh.roadSlot.includes(j)){
                        road.neigh.roadSlot.push(j);
                    }
                }
                
            }
        });
    }
    
    // Add ports
    
    console.log(graph);
 
    let borderEdges = [];

    borderEdges.push(0);

    while(true) {
        let current = graph.roadSlot[borderEdges.at(-1)];
        let count = 0;
        for (let n of current.neigh.roadSlot){
            if (graph.roadSlot[n].neigh.hexagon.length == 1 && !borderEdges.includes(n)){
                borderEdges.push(n);
                count += 1;
            } 
        }
        if (count == 0){
            break;
        }
    }


    console.log(borderEdges);
    const select = PickWithoutRepeat(borderEdges,9);
    console.log(select);
    

    for (let hex of select) {

        const x = graph.roadSlot[hex].x;
        const y = graph.roadSlot[hex].y;
        const hexagonPositions = graph.hexagon[graph.roadSlot[hex].neigh.hexagon[0]].neigh.roadSlot;
        const anglePort = hexagonPositions.indexOf(hex);
        const portW = 6;
        const portH = 20;
        const resource = Object.keys(resources)[randomRange(0, Object.keys(resources).length)];
        graph.roadSlot[hex].neigh.settleSlot.forEach(s =>{
            graph.settleSlot[s].addPort(resource);
        });
    
        context.save();
        context.fillStyle = 'brown';
        context.translate(x, y);
        context.rotate((60 * anglePort) / 180 * Math.PI);
        context.rotate(15 / 180 * Math.PI);
        context.beginPath();
        context.rect(-portH, 15, portH, portW);
        context.rotate(-30 / 180 * Math.PI);
        context.rect(-portH, -15, portH, portW);
        context.fillText(resource, -portH * 2 , 0);
        context.fillText("2:1", -portH * 2 , 10);
        context.closePath();
        context.fill();
        context.restore();

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
        hand.innerHTML = `${JSON.stringify(currentPlayer.hand.resources)}`;
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
                            p.hand.resources[h.resources] += 1;
                        }
                    }
                }
            }
        }
        let currentPlayer;
        currentPlayer = this.playersList[this.turn % this.playersList.length];
        hand.innerHTML = `${JSON.stringify(currentPlayer.hand.resources)}`;
    }
}



class Player {
    constructor (name, color) {
        this.color = color;
        this.score = 0;
        this.name = name;
        this.hand = {resources: {grass: 0,
                                 brick: 0,
                                 wood: 0,
                                 rock: 0,
                                 wheat: 0},
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
        this.port;

    }

    addPort(resource) {
        this.port = resource;
    }

}




