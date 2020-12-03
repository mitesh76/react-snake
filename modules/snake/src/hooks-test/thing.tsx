import * as React from 'react';
import {useState, useEffect} from 'react';

export interface IThingProps {
    name: string,
    counter: number
}

export const Thing = (name: string, counter: number) => {
    
    const [count, setCount] = useState(0);
  
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }