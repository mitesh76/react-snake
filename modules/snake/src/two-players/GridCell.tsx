import * as React from 'react';
import { Position } from './position';
import { Player } from './Game';

export const GridCell = (rowIndex: number, colIndex: number, players: Player[], foodPosition: Position) => {
    
    //is cell a food
    let cellClass = (rowIndex == foodPosition.y && colIndex == foodPosition.x) ? "food" : "";

    //is cell a player snake
    players.forEach(p => { if (p.snake.some(s => s.x == colIndex && s.y == rowIndex)) { cellClass = `snake-${p.className}` } });

    return <td key={`${rowIndex}-${colIndex}`} className={cellClass}></td>
}
    
