

export class TargetController {
    TargetList: Target[];
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.TargetList = [];
        this.canvas = canvas;
        this.context = context;
    }
    generateTarget = () => {
        if (this.TargetList.length > 0) return;
        let radius = [5, 15];
        let x = [0, this.canvas.width];
        let y = [0, this.canvas.height];
        const target = new Target(getRandomInRange(x), getRandomInRange(y), getRandomInRange(radius));
        this.TargetList.push(target);
    };
    draw = () => {
        this.TargetList.forEach(target => target.draw(this.context));
    };
    query = (x: number, y: number, onSuccess: () => any) => {
        let targets: Target[] = [];
        this.TargetList.forEach(target => {
            if (distance([target.x, target.y], [x, y]) < target.radius) {
                targets.push(target);
            }
        });
        for (const target of targets) {
            this.TargetList.splice(this.TargetList.indexOf(target), 1);
            onSuccess();
        }
    };
}

class Target {
    x: number;
    y: number;
    radius: number;
    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw = (context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.fillStyle = "red";
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    };
}

const distance = (n1: number[], n2: number[]) => {
    return Math.sqrt((n1[0] - n2[0]) ** 2 + (n1[1] - n2[1]) ** 2);
};

const getRandomInRange = (range: number[]) => {
    return range[0] + (Math.random() * (range[1] - range[0]));
};