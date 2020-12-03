import * as React from 'react';
import { Position } from './position';

export const GridCell = (rowIndex: number, colIndex: number, snake: Position[], foodPosition: Position, direction: string) => {
    
    //is any part of the snake or food in this cell
    let cellClass = snake.some(s => s.x == colIndex && s.y == rowIndex) ? "snake" : (rowIndex == foodPosition.y && colIndex == foodPosition.x) ? "food" : "";

    //is snake head?
    let head = snake[snake.length - 1];
    if(head.x == colIndex && head.y == rowIndex) {
        cellClass = `snake-head-${direction}`;
    }

    return <td key={`${rowIndex}-${colIndex}`} className={cellClass}></td>
}
    
