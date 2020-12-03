import * as React from 'react';
import { Position } from './position';
import { GridRow } from './GridRow';

export interface IGameProps { gridSize: number; }

export interface IGameState {
    score: number;
    snake: Position[];
    foodPosition: Position;
    direction: string; // Tried to use an enum for directions but this had a performance impact (slight lag after key press). String seems to be better performant.
    gameSpeed: number;
    gameActive: boolean;
}

export default class Game extends React.Component<IGameProps, IGameState> { 

    componentWillMount = () => {
        this.initNewGame();
        document.addEventListener("keydown", this.handleKeyDown, false); //Event listener for key press
    }
    
    initNewGame = () => {
        const snake : Position[] = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];
        const foodPosition : Position = this.getRandomPositionInGrid();
        const speed : number = 200;
        this.setState({score: 0, snake: snake, foodPosition: foodPosition, direction: "down", gameSpeed: speed, gameActive: true});
        
        setInterval(this.handleMoves, speed); //Start ticks
    }
    
    getRandomPositionInGrid = () => {
        const { gridSize } = this.props;
        const x = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        const y = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        return { x: x, y: y };
    }

    getRandomDirection = () => {
        const directions : string[] = ["up","down","left","right"];
        return directions[Math.floor(Math.random() * 4)];
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
        const { foodPosition } = this.state;
        if (newSnakeHead.x == foodPosition.x && newSnakeHead.y == foodPosition.y) return true;
        return false;
    }

    moveFood = (foodPosition: Position) => {
        const {gridSize} = this.props;
        const direction: string = this.getRandomDirection();
        switch(direction) {
            case "up": 
                if(foodPosition.y > 0) foodPosition.y--; break;
            case "down": 
                if(foodPosition.y < gridSize - 1) foodPosition.y++; break;
            case "left": 
                if(foodPosition.x > 0) foodPosition.x--; break;
            case "right": 
                if(foodPosition.x < gridSize - 1) foodPosition.x++; break;
        }
    }

    handleMoves = () => {

        const { direction, snake, gameActive } = this.state;
        let { score, foodPosition, gameSpeed } = this.state;

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
            score++;
            foodPosition = this.getRandomPositionInGrid();

            // Increase game speed - TODO
            // gameSpeed = Math.floor(gameSpeed * 1.1);
            // console.log("eat", gameSpeed);
            // setInterval(this.moveSnake, gameSpeed);
        }
        else {
            snake.shift();
        }

        //move food
        this.moveFood(foodPosition);

        this.setState({snake : snake, score : score, foodPosition : foodPosition, gameSpeed: gameSpeed});
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
        const { score, snake, foodPosition, gameActive, direction } = this.state;
        const { gridSize } = this.props;

        let gridRows = [];
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) { 
            gridRows.push(GridRow(gridSize, snake, rowIndex, foodPosition, direction)) 
        }

        return <React.Fragment>
            <div className="game-container">
                <div className="game-header">
                    <h1>{gameActive ? "SNAKE!" : "GAME OVER!"}</h1>
                    <span className="score">Score: {score}</span>
                </div>
                <table className="snake-table"><tbody>{gridRows}</tbody></table></div>
        </React.Fragment>
    }

}