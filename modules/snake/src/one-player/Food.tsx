export class Food {
    name: string;
    value: number;
    position: Position;

    constructor(name: string, value: number, position: Position) {
        this.name = name;
        this.value = value;
        this.position = position;
    }

    move(direction: string, steps: number) {
        console.log(this.name, direction, steps);
    }
}

export class Mouse extends Food {
    
    constructor(position: Position) {
        super("Mouse", 1, position);
    }

    move(direction: string) {
        super.move("up", 2);
    }
    

}