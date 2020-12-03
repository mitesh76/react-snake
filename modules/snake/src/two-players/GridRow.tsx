import * as React from 'react';
import { Player } from './Game';
import { GridCell } from './GridCell';
import { Position } from './position';

export const GridRow = (gridSize: number, players: Player[], rowIndex: number, foodPosition: Position) => {
    
    let cells = [];
    for(var colIndex = 0; colIndex < gridSize; colIndex++) { cells.push(GridCell(rowIndex, colIndex, players, foodPosition)) }
    return <tr key={rowIndex}>{cells}</tr>
}