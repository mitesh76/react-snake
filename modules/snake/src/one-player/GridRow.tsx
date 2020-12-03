import * as React from 'react';
import { GridCell } from './GridCell';
import { Position } from './position';
import { Food } from './Food';

export const GridRow = (gridSize: number, snake: Position[], rowIndex: number, food: Food, direction: string) => {
    
    let cells = [];
    for(var colIndex = 0; colIndex < gridSize; colIndex++) { cells.push(GridCell(rowIndex, colIndex, snake, food, direction)) }
    return <tr key={rowIndex}>{cells}</tr>
}