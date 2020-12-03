
/* TWO PLAYER GAME */

import * as React from 'react';
import { Position } from './position';
import { GridRow } from './GridRow';

export interface Player {
    name: string;
    score: number;
    gameActive: boolean;
    snake: Position[];
    direction: string;
    className: string;
}

export interface IGameProps { gridSize: number; }

export interface IGameState {
    
    players: Player[];
    foodPosition: Position;
    gameActive: boolean;
}

export default class Game extends React.Component<IGameProps, IGameState> { 

    componentWillMount = () => {
        this.initNewGame();
        document.addEventListener("keydown", this.handleKeyDown, false); //Event listener for key press
    }
    
    initNewGame = () => {

        const { gridSize } = this.props;

        const player1 : Player = {name: "Player 1", snake : [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}], direction: "down", score: 0, gameActive: true, className: "player1" }
        const player2 : Player = {name: "Player 2", snake : [{x: gridSize - 1, y: 0}, {x: gridSize - 1, y: 1}, {x: gridSize - 1, y: 2}], direction: "down", score: 0, gameActive: true, className: "player2" }
        const players : Player[] = [player1, player2]

        const foodPosition : Position = this.getRandomPositionInGrid();

        const speed : number = 400;
        this.setState({ foodPosition: foodPosition, gameActive: true, players: players });
        
        setInterval(this.moveSnake, speed); //Start ticks
    }
    
    getRandomPositionInGrid = () => {
        const { gridSize } = this.props;
        const x = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        const y = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        return { x: x, y: y };
    }

    collision = ( snakeHead : Position, snake: Position[] ) => {

        const { gridSize } = this.props;
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

    moveSnake = () => {

        const { players, gameActive } = this.state;
        let { foodPosition } = this.state;

        if (!gameActive) return;

        players.forEach(p => {

            if(!p.gameActive) return;

            const currentSnakeHead = p.snake[p.snake.length - 1];
            
            let x = currentSnakeHead.x;
            let y = currentSnakeHead.y;

            switch(p.direction) {
                case "up": y--; break;
                case "down": y++; break;
                case "left": x--; break;
                case "right": x++; break;
            }
        
            const newSnakeHead : Position = {x: x, y: y};

            //check collision
            if (this.collision(newSnakeHead, p.snake)) { 
                p.gameActive = false;    
            } 
            else {
                //push new head onto snake array
                p.snake.push(newSnakeHead);
            };

            //check if snake can eat food. if yes increase score, reposition new food and allow snake to grow by not shifting array. else shift array.
            if (this.eat(newSnakeHead)) {
                p.score++;
                foodPosition = this.getRandomPositionInGrid();
            }
            else {
                p.snake.shift();
            }
        });

        const endGame = players.filter(p => p.gameActive == false).length == players.length;

        this.setState({ players: players, foodPosition : foodPosition, gameActive: !endGame });
    }

    handleKeyDown = (e: KeyboardEvent) => {

        const { players, gameActive } = this.state;
        
        if (!gameActive) return;

        let player1 = players[0];
        let player2 = players[1];

        switch (e.code) {
            //player 1
            case "ArrowUp": player1.direction = "up"; break;
            case "ArrowDown": player1.direction = "down"; break;
            case "ArrowLeft": player1.direction = "left"; break;
            case "ArrowRight": player1.direction = "right"; break;
            //player 2
            case "KeyA": player2.direction = "up"; break;
            case "KeyZ": player2.direction = "down"; break;
            case "KeyX": player2.direction = "left"; break;
            case "KeyC": player2.direction = "right"; break;
        }

        this.setState({players: players});
    }
    
    public render() {
        const { players, foodPosition, gameActive } = this.state;
        const { gridSize } = this.props;

        let gridRows = [];
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) { 
            gridRows.push(GridRow(gridSize, players, rowIndex, foodPosition)) 
        }

        return <React.Fragment>
            <div className="game-container">
                <div className="game-header">
                    <h1>{gameActive ? "SNAKE!" : "GAME OVER!"}</h1>
                    {players.map(p => {
                        return <div className="score">{`${p.name} score: ${p.score} ${p.gameActive ? "" : "GAME OVER!"}`}</div>
                    })}
                </div>
                <table className="snake-table"><tbody>{gridRows}</tbody></table></div>
        </React.Fragment>
    }
}