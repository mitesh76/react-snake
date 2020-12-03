import * as React from 'react';
import { Position } from './position';
import { Food } from './Food';

export const GridCell = (rowIndex: number, colIndex: number, snake: Position[], food: Food, direction: string) => {
    
    //is any part of the snake or food in this cell
    let cellClass = snake.some(s => s.x == colIndex && s.y == rowIndex) ? "snake" : (rowIndex == food.position.y && colIndex == food.position.x) ? "food" : "";

    //is snake head?
    let head = snake[snake.length - 1];
    if(head.x == colIndex && head.y == rowIndex) {
        cellClass = `snake-head-${direction}`;
    }

    return <td key={`${rowIndex}-${colIndex}`} className={cellClass}></td>
}
    
