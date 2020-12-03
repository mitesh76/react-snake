import * as React from 'react';
import { Position } from './position';

export const GridCell = (rowIndex: number, colIndex: number, snake: Position[], foodPosition: Position) => {
    
    //is any part of the snake or food in this cell
    let cellClass = snake.some(s => s.x == colIndex && s.y == rowIndex) ? "snake" : (rowIndex == foodPosition.y && colIndex == foodPosition.x) ? "food" : "";

    return <td key={`${rowIndex}-${colIndex}`} className={cellClass}></td>
}
    
