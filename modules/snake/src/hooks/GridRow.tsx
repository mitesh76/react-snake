import * as React from 'react';
import { GridCell } from './GridCell';
import { Position } from './position';

export const GridRow = (gridSize: number, snake: Position[], rowIndex: number, foodPosition: Position) => {
    
    let cells = [];
    for(var colIndex = 0; colIndex < gridSize; colIndex++) { cells.push(GridCell(rowIndex, colIndex, snake, foodPosition)) }
    return <tr key={rowIndex}>{cells}</tr>
}