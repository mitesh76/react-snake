import * as React from 'react';
import { Position } from './position';
import { GridRow } from './GridRow';
import { Food, Mouse, DeadMouse, Bug, BlindMouse } from './Food';

export interface IGameProps { gridSize: number; }

export interface IGameState {
    foodList: (Mouse | Bug | DeadMouse | BlindMouse)[];
    score: number;
    snake: Position[];
    currentFood: Mouse | Bug | DeadMouse | BlindMouse;
    direction: string; // Tried to use an enum for directions but this had a performance impact (slight lag after key press). String seems to be better performant.
    gameSpeed: number;
    gameActive: boolean;
}

export default class Game extends React.Component<IGameProps, IGameState> { 

    componentWillMount = () => {
        this.initNewGame();
        document.addEventListener("keydown", this.handleKeyDown, false); //Event listener for key press
    }
    
    pickRandomFoodFromList = (list: (Mouse | Bug | DeadMouse | BlindMouse)[]) => {
        const rand = Math.floor(Math.random() * (list.length));
        const food = list[rand];
        food.position = this.getRandomPositionInGrid();
        return food;
    }

    initNewGame = () => {
        // generate list of food items
        const mouse = new Mouse(this.getRandomPositionInGrid());
        const bug = new Bug(this.getRandomPositionInGrid());
        const deadMouse = new DeadMouse(this.getRandomPositionInGrid());
        const blindMouse = new BlindMouse(this.getRandomPositionInGrid());
        const foodList = [ mouse, bug, deadMouse, blindMouse ];        

        const currentFood = this.pickRandomFoodFromList(foodList);

        const snake : Position[] = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];
        
        const speed : number = 200;
        this.setState({score: 0, snake: snake, currentFood: currentFood, direction: "down", gameSpeed: speed, gameActive: true, foodList: foodList});
        
        setInterval(this.handleMoves, speed); //Start ticks
    }
    
    getRandomPositionInGrid = () => {
        const { gridSize } = this.props;
        const x = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        const y = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        return { x: x, y: y };
    }

    collision = (snakeHead : Position) => {
        
        const {snake} = this.state;
        const {gridSize} = this.props;

        if ((snake.some(snakePart => snakePart.x == snakeHead.x && snakePart.y == snakeHead.y)) || 
            (snakeHead.x == gridSize || snakeHead.y == gridSize) ||
            (snakeHead.x < 0 || snakeHead.y < 0)
        ) return true;

        return false;
    }

    eat = (newSnakeHead : Position) => {
        const { currentFood } = this.state;
        if (newSnakeHead.x == currentFood.position.x && newSnakeHead.y == currentFood.position.y) return true;
        return false;
    }

    handleMoves = () => {
        const { gridSize } = this.props;
        const { direction, snake, gameActive, foodList } = this.state;
        let { score, currentFood, gameSpeed } = this.state;

        if (!gameActive) return;

        const currentSnakeHead = snake[snake.length - 1];

        let x = currentSnakeHead.x;
        let y = currentSnakeHead.y;

        switch(direction) {
            case "up": y--; break;
            case "down": y++; break;
            case "left": x--; break;
            case "right": x++; break;
        }

        const newSnakeHead : Position = {x: x, y: y};

        //check collision
        if (this.collision(newSnakeHead)) { this.setState({gameActive: false}); return; };

        //push new head onto snake array
        snake.push(newSnakeHead);

        //check if snake can eat food. if yes increase score, reposition new food and allow snake to grow by not shifting array. else shift array.
        if (this.eat(newSnakeHead)) {
            score = score + currentFood.value;
            currentFood = this.pickRandomFoodFromList(foodList);
        }
        else {
            snake.shift();
        }

        //move food
        currentFood.move(gridSize);
        
        this.setState({snake : snake, score : score, currentFood : currentFood, gameSpeed: gameSpeed});
    }

    handleKeyDown = (e: KeyboardEvent) => {
        const { gameActive } = this.state;
        
        if (!gameActive) return;

        switch (e.key) {
            case "ArrowUp": this.setState({ direction: "up" }); break;
            case "ArrowDown": this.setState({ direction: "down" }); break;
            case "ArrowLeft": this.setState({ direction: "left" }); break;
            case "ArrowRight": this.setState({ direction: "right" }); break;
        }
    }
    
    public render() {
        const { score, snake, currentFood, gameActive, direction } = this.state;
        const { gridSize } = this.props;

        let gridRows = [];
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) { 
            gridRows.push(GridRow(gridSize, snake, rowIndex, currentFood, direction)) 
        }

        return <React.Fragment>
            <div className="game-container">
                <div className="game-header">
                    <h1>{gameActive ? "SNAKE!" : "GAME OVER!"}</h1>
                    <span className="score">Score: {score}</span>
                    <span className="score"> {currentFood.name}</span>
                </div>
                <table className="snake-table"><tbody>{gridRows}</tbody></table></div>
        </React.Fragment>
    }
}