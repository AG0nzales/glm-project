import React, { useRef, useEffect, useCallback, useState } from "react";

// Game configuration constants
const GAME_CONFIG = {
  GRAVITY: 0.25,
  JUMP_VELOCITY: -7,
  PIPE_SPEED: 3,
  PIPE_WIDTH: 60,
  PIPE_GAP: 180,
  PIPE_SPAWN_INTERVAL: 2000, // ms
  BIRD_SIZE: 30,
  GROUND_HEIGHT: 50,
} as const;

// Game state types
type GameState = "start" | "playing" | "gameover";

// Bird interface
interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

// Pipe interface
interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

// Props interface
interface FlappyGameProps {
  width?: number;
  height?: number;
  className?: string;
  birdImage?: string; // URL to custom bird image
}

const FlappyGame: React.FC<FlappyGameProps> = ({
  width = 400,
  height = 600,
  className = "",
  birdImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const pipeSpawnTimeoutRef = useRef<number | null>(null);
  const birdImageRef = useRef<HTMLImageElement | null>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Game objects
  const birdRef = useRef<Bird>({
    x: width * 0.2,
    y: height / 2,
    velocity: 0,
    rotation: 0,
  });

  const pipesRef = useRef<Pipe[]>([]);

  // Initialize bird position
  useEffect(() => {
    birdRef.current = {
      x: width * 0.2,
      y: height / 2,
      velocity: 0,
      rotation: 0,
    };
  }, [width, height]);

  // Load bird image
  useEffect(() => {
    if (birdImage) {
      const img = new Image();
      img.onload = () => {
        birdImageRef.current = img;
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error("Failed to load bird image");
        birdImageRef.current = null;
        setImageLoaded(false);
      };
      img.src = birdImage;
    } else {
      birdImageRef.current = null;
      setImageLoaded(false);
    }
  }, [birdImage]);

  // Reset game
  const resetGame = useCallback(() => {
    birdRef.current = {
      x: width * 0.2,
      y: height / 2,
      velocity: 0,
      rotation: 0,
    };
    pipesRef.current = [];
    setScore(0);
    setGameState("playing");
  }, [width, height]);

  // Jump action
  const jump = useCallback(() => {
    if (gameState === "start") {
      resetGame();
    } else if (gameState === "playing") {
      birdRef.current.velocity = GAME_CONFIG.JUMP_VELOCITY;
    } else if (gameState === "gameover") {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  // Handle click/tap input
  const handleCanvasClick = useCallback(() => {
    jump();
  }, [jump]);

  // Spawn pipe
  const spawnPipe = useCallback(() => {
    const minGapY = 80;
    const maxGapY =
      height - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.PIPE_GAP - 80;
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

    pipesRef.current.push({
      x: width,
      gapY,
      passed: false,
    });
  }, [width, height]);

  // Check collision
  const checkCollision = useCallback(
    (bird: Bird, pipes: Pipe[]): boolean => {
      // Ground collision
      if (
        bird.y + GAME_CONFIG.BIRD_SIZE / 2 >
        height - GAME_CONFIG.GROUND_HEIGHT
      ) {
        return true;
      }

      // Ceiling collision
      if (bird.y - GAME_CONFIG.BIRD_SIZE / 2 < 0) {
        return true;
      }

      // Pipe collision
      for (const pipe of pipes) {
        const birdLeft = bird.x - GAME_CONFIG.BIRD_SIZE / 2;
        const birdRight = bird.x + GAME_CONFIG.BIRD_SIZE / 2;
        const birdTop = bird.y - GAME_CONFIG.BIRD_SIZE / 2;
        const birdBottom = bird.y + GAME_CONFIG.BIRD_SIZE / 2;

        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + GAME_CONFIG.PIPE_WIDTH;

        // Check if bird is within pipe x range
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          // Check if bird hits top pipe
          if (birdTop < pipe.gapY) {
            return true;
          }
          // Check if bird hits bottom pipe
          if (birdBottom > pipe.gapY + GAME_CONFIG.PIPE_GAP) {
            return true;
          }
        }
      }

      return false;
    },
    [height],
  );

  // Update game state
  const update = useCallback(() => {
    if (gameState !== "playing") return;

    const bird = birdRef.current;
    const pipes = pipesRef.current;

    // Update bird physics
    bird.velocity += GAME_CONFIG.GRAVITY;
    bird.y += bird.velocity;

    // Update bird rotation based on velocity
    bird.rotation = Math.min(Math.max(bird.velocity * 3, -30), 90);

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= GAME_CONFIG.PIPE_SPEED;

      // Check if bird passed pipe
      if (!pipes[i].passed && pipes[i].x + GAME_CONFIG.PIPE_WIDTH < bird.x) {
        pipes[i].passed = true;
        setScore((prev) => {
          const newScore = prev + 1;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
      }

      // Remove off-screen pipes
      if (pipes[i].x + GAME_CONFIG.PIPE_WIDTH < 0) {
        pipes.splice(i, 1);
      }
    }

    // Check collision
    if (checkCollision(bird, pipes)) {
      setGameState("gameover");
    }
  }, [gameState, checkCollision, highScore]);

  // Helper function to draw clouds
  const drawCloud = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size * 1.5, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  };

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bird = birdRef.current;
    const pipes = pipesRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, "#87CEEB");
    skyGradient.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    drawCloud(ctx, 50, 80, 40);
    drawCloud(ctx, 200, 120, 30);
    drawCloud(ctx, 320, 60, 35);

    // Draw pipes
    pipes.forEach((pipe) => {
      // Top pipe
      const topPipeGradient = ctx.createLinearGradient(
        pipe.x,
        0,
        pipe.x + GAME_CONFIG.PIPE_WIDTH,
        0,
      );
      topPipeGradient.addColorStop(0, "#73BF2E");
      topPipeGradient.addColorStop(0.5, "#8ED349");
      topPipeGradient.addColorStop(1, "#5DA423");

      ctx.fillStyle = topPipeGradient;
      ctx.fillRect(pipe.x, 0, GAME_CONFIG.PIPE_WIDTH, pipe.gapY);

      // Top pipe cap
      ctx.fillStyle = "#5DA423";
      ctx.fillRect(pipe.x - 5, pipe.gapY - 30, GAME_CONFIG.PIPE_WIDTH + 10, 30);

      // Bottom pipe
      const bottomPipeY = pipe.gapY + GAME_CONFIG.PIPE_GAP;
      const bottomPipeGradient = ctx.createLinearGradient(
        pipe.x,
        0,
        pipe.x + GAME_CONFIG.PIPE_WIDTH,
        0,
      );
      bottomPipeGradient.addColorStop(0, "#73BF2E");
      bottomPipeGradient.addColorStop(0.5, "#8ED349");
      bottomPipeGradient.addColorStop(1, "#5DA423");

      ctx.fillStyle = bottomPipeGradient;
      ctx.fillRect(
        pipe.x,
        bottomPipeY,
        GAME_CONFIG.PIPE_WIDTH,
        height - bottomPipeY - GAME_CONFIG.GROUND_HEIGHT,
      );

      // Bottom pipe cap
      ctx.fillStyle = "#5DA423";
      ctx.fillRect(pipe.x - 5, bottomPipeY, GAME_CONFIG.PIPE_WIDTH + 10, 30);
    });

    // Draw ground
    const groundGradient = ctx.createLinearGradient(
      0,
      height - GAME_CONFIG.GROUND_HEIGHT,
      0,
      height,
    );
    groundGradient.addColorStop(0, "#DEB887");
    groundGradient.addColorStop(1, "#D2691E");
    ctx.fillStyle = groundGradient;
    ctx.fillRect(
      0,
      height - GAME_CONFIG.GROUND_HEIGHT,
      width,
      GAME_CONFIG.GROUND_HEIGHT,
    );

    // Draw ground pattern
    ctx.fillStyle = "#C19A6B";
    for (let i = 0; i < width; i += 20) {
      ctx.fillRect(i, height - GAME_CONFIG.GROUND_HEIGHT, 10, 5);
    }

    // Draw bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate((bird.rotation * Math.PI) / 180);

    if (imageLoaded && birdImageRef.current) {
      // Draw custom bird image
      const img = birdImageRef.current;
      const imageSize = GAME_CONFIG.BIRD_SIZE;
      ctx.drawImage(
        img,
        -imageSize / 2,
        -imageSize / 2,
        imageSize,
        imageSize
      );
    } else {
      // Bird body
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        GAME_CONFIG.BIRD_SIZE / 2,
        GAME_CONFIG.BIRD_SIZE / 2.5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Bird wing
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.ellipse(-5, 5, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Bird eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(8, -5, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(10, -5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Bird beak
      ctx.fillStyle = "#FF6347";
      ctx.beginPath();
      ctx.moveTo(12, 2);
      ctx.lineTo(22, 5);
      ctx.lineTo(12, 8);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // Draw score
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.strokeText(score.toString(), width / 2, 60);
    ctx.fillText(score.toString(), width / 2, 60);

    // Draw start screen
    if (gameState === "start") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.strokeText("Flappy Bird", width / 2, height / 2 - 40);
      ctx.fillText("Flappy Bird", width / 2, height / 2 - 40);

      ctx.font = "bold 24px Arial";
      ctx.strokeText(
        "Click or Press Space to Start",
        width / 2,
        height / 2 + 20,
      );
      ctx.fillText("Click or Press Space to Start", width / 2, height / 2 + 20);
    }

    // Draw game over screen
    if (gameState === "gameover") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.strokeText("Game Over", width / 2, height / 2 - 60);
      ctx.fillText("Game Over", width / 2, height / 2 - 60);

      ctx.font = "bold 28px Arial";
      ctx.strokeText(`Score: ${score}`, width / 2, height / 2);
      ctx.fillText(`Score: ${score}`, width / 2, height / 2);

      ctx.strokeText(`Best: ${highScore}`, width / 2, height / 2 + 40);
      ctx.fillText(`Best: ${highScore}`, width / 2, height / 2 + 40);

      ctx.font = "bold 24px Arial";
      ctx.strokeText(
        "Click or Press Space to Restart",
        width / 2,
        height / 2 + 100,
      );
      ctx.fillText(
        "Click or Press Space to Restart",
        width / 2,
        height / 2 + 100,
      );
    }
  }, [width, height, gameState, score, highScore, imageLoaded]);

  // Main game loop
  useEffect(() => {
    const gameLoop = () => {
      update();
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [update, draw]);

  // Pipe spawning
  useEffect(() => {
    if (gameState === "playing") {
      const spawnPipeLoop = () => {
        spawnPipe();
        pipeSpawnTimeoutRef.current = window.setTimeout(
          spawnPipeLoop,
          GAME_CONFIG.PIPE_SPAWN_INTERVAL,
        );
      };

      spawnPipeLoop();

      return () => {
        if (pipeSpawnTimeoutRef.current) {
          clearTimeout(pipeSpawnTimeoutRef.current);
        }
      };
    }
  }, [gameState, spawnPipe]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        className="rounded-lg shadow-2xl cursor-pointer"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default FlappyGame;
