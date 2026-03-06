import FlappyGame from "./components/FlappyGame";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
        Flappy Bird Game
      </h1>
      {/* Use the birdImage prop to provide a custom bird image */}
      {/* Example: <FlappyGame width={400} height={600} className="mb-8" birdImage="/path/to/your/bird-image.png" /> */}
      <FlappyGame width={400} height={600} className="mb-8" birdImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4R0G-ys08bTgWzhY12K8Rq6c6HqQtD8wBLQ&s" />
      <p className="text-white text-lg drop-shadow">
        Click or press Space to play!
      </p>
    </div>
  );
}

export default App;
