import { useEffect, useState } from "react"; //import syntax
import { TargetController } from "./components/TargetController";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let game: GameState;
let targets: TargetController;
let interval: any;
function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false); //state variable, updating this causes a change in state (rerender of the DOM)
  const [score, setScore] = useState<number>(0)
    ; useEffect(() => {
      canvas = document.getElementById("canvas") as HTMLCanvasElement; //gets canvas
      context = canvas.getContext("2d") as CanvasRenderingContext2D; //gets canvas drawing context
      if (window.innerWidth < 768) {
        canvas.width = canvas.height = 300;
      } else {
        canvas.width = canvas.height = 600;
      }
      game = new GameState();
      document.addEventListener("click", handleClick); //adds event listeners for the sepcified events, funcitons called on the events passed as references
      document.addEventListener("touchstart", handleTouch);
      frame(0);
    }, []);
  const handleClick = (event: MouseEvent) => {
    registerClick(event.clientX, event.clientY);
  };
  const handleTouch = (event: TouchEvent) => {
    registerClick(event.touches[0].clientX, event.touches[0].clientY);
  };
  const registerClick = (x: number, y: number) => {
    const canvasRect: DOMRect = canvas.getBoundingClientRect(); //produces an object containing the bounds of the canvas relative to the page
    const adjX = x - canvasRect.left;
    const adjY = y - canvasRect.top;
    targets?.query(adjX, adjY, updateScore); // ? checks if targets is defined before calling method
  };
  const updateScore = () => {
    game.score++;
    setScore(game.score);
  };
  const frame = (currentTime: number) => {
    resetCanvas();
    if (game.isPlaying) {
      targets.draw(); //draws the targets if the game is being played
    }
    requestAnimationFrame(frame);
  };
  const generate = () => {
    if (game.isPlaying) {
      targets.generateTarget();
    }
  };
  const resetCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  const endGame = () => {
    setIsPlaying(false);
    game = new GameState();
    setScore(0);
    clearInterval(interval); // clears set interval by interval id
  };
  const startGame = () => {
    targets = new TargetController(context, canvas);
    interval = setInterval(generate, 10); // sets an interval to call function generate every 10 ms. Stores interval id in interval variable
    setIsPlaying(true);
    game.isPlaying = true;
  };
  //tailwindcss used, normal css stylesheets can also be used by editing index.css
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <p className="text-3xl">Click the target!</p>
      <canvas id="canvas" className="border border-black" />
      {/* React templating language. Renders a different button based upon the value of isPlaying */}
      {
        isPlaying ?
          <div className="flex flex-col justify-center items-center gap-2">
            <p>Your Score: {score}</p>
            <StyledButton click={endGame} text="End" />
          </div>
          :
          <StyledButton click={startGame} text="Start" />
      }
    </div>
  );
}

export default App; //exposes App component to React

//custom type definition (typescript)
type StyledButtonProps = {
  click: () => any;
  text: string;
};
function StyledButton({ click, text }: StyledButtonProps) {
  // React component, like a function, but returns HTML
  return (
    <button
      onClick={click}
      className="md:py-4 md:px-8 py-2 px-4 bg-blue-600 rounded-lg"
    >
      {text}
    </button>
  );
}
class GameState { //game state class designed to hold game state within reference-based function calls
  isPlaying: boolean;
  score: number;
  constructor() {
    this.isPlaying = false;
    this.score = 0;
  }
}
