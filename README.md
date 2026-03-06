# Flappy Bird Game 🐦

A modern Flappy Bird clone built with React, TypeScript, and Vite, featuring innovative microphone-based controls and balanced gameplay.

![Flappy Bird](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)

## ✨ Features

### 🎮 Gameplay
- **Balanced Physics**: Optimized gravity and jump velocity for a more enjoyable experience
- **Smooth Animations**: 60 FPS gameplay with fluid bird movement
- **Score Tracking**: Current score and high score persistence
- **Responsive Design**: Works on desktop and mobile devices

### 🎤 Microphone Control (NEW!)
- **Voice/Sound Control**: Control the bird using your voice or any sound
- **Volume Threshold System**: Configurable sensitivity to prevent accidental jumps
- **Real-time Volume Meter**: Visual feedback showing your microphone input level
- **Jump Cooldown**: Prevents rapid-fire triggering for better control
- **Easy Mode Switching**: Toggle between keyboard/click and microphone control

### 🎨 Visual Design
- **Beautiful Graphics**: Gradient skies, animated clouds, and detailed pipes
- **Smooth Bird Animation**: Rotating bird based on velocity
- **Polished UI**: Clean interface with clear feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd glm-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

### Keyboard/Click Mode (Default)
- **Spacebar** or **Click/Tap**: Make the bird flap and fly upward
- Navigate through the gaps in the pipes
- Avoid hitting pipes, the ground, or the ceiling

### Microphone Mode 🎤
1. Click the "🎤 Mic" button in the top-right corner
2. Allow microphone access when prompted
3. Make sounds to control the bird:
   - **Clap your hands**
   - **Whistle**
   - **Say "jump"**
   - **Any sound**
4. The volume meter shows your input level
5. **Louder sounds = more upward lift**
6. **No sound = bird falls due to gravity**
7. The lift force is displayed in real-time

### Tips for Microphone Control
- Make continuous sounds for steady lift
- Louder sounds provide more upward force
- Adjust your distance from the microphone as needed
- The system responds in real-time to your voice volume
- Practice finding the right volume level for your play style

## 🛠️ Technical Details

### Game Configuration
The game uses balanced physics constants for optimal gameplay:

```typescript
GRAVITY: 0.15              // Reduced from 0.25 for slower descent
JUMP_VELOCITY: -5.5        // Adjusted for better jump height (keyboard mode)
PIPE_SPEED: 3              // Speed of pipe movement
PIPE_GAP: 180              // Gap size between pipes
MIC_LIFT_MULTIPLIER: 8     // Max upward velocity from microphone (mic mode)
VOLUME_SMOOTHING: 0.8      // Smoothing factor for volume readings
```

### Architecture
- **React Hooks**: Uses `useRef`, `useEffect`, `useCallback`, and `useState` for state management
- **Web Audio API**: Real-time microphone input analysis
- **Canvas API**: High-performance 2D rendering
- **TypeScript**: Full type safety throughout the codebase

### Browser Requirements
- Modern browser with Web Audio API support
- Microphone access (for microphone control mode)
- HTTPS or localhost (required for microphone access)

## 📁 Project Structure

```
glm-project/
├── src/
│   ├── components/
│   │   └── FlappyGame.tsx    # Main game component
│   ├── App.tsx                # App root
│   ├── main.tsx               # Entry point
│   └── assets/                # Static assets
├── public/                    # Public files
├── plans/                     # Development plans
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
└── tailwind.config.js         # Tailwind CSS config
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adjusting Game Balance
Edit the `GAME_CONFIG` constant in [`src/components/FlappyGame.tsx`](src/components/FlappyGame.tsx:4):

```typescript
const GAME_CONFIG = {
  GRAVITY: 0.15,              // Lower = slower descent
  JUMP_VELOCITY: -5.5,        // More negative = higher jump
  PIPE_SPEED: 3,               // Higher = faster pipes
  PIPE_GAP: 180,              // Larger = easier gameplay
  VOLUME_THRESHOLD: 0.2,      // Lower = more sensitive mic
  JUMP_COOLDOWN: 150,         // Higher = slower response
};
```

### Adjusting Microphone Sensitivity
- **Adjust `MIC_LIFT_MULTIPLIER`**: Higher values = more lift force from same volume
- **Adjust `VOLUME_SMOOTHING`**: Higher values reduce jitter but increase response time
- The volume meter shows real-time lift force applied to the bird

## 🐛 Troubleshooting

### Microphone Not Working
1. Ensure you're on HTTPS or localhost
2. Check browser permissions for microphone access
3. Try a different browser (Chrome, Firefox, Safari)
4. Check if another application is using the microphone

### Game Too Easy/Difficult
- Adjust `GRAVITY` and `JUMP_VELOCITY` in the game config
- Modify `PIPE_SPEED` to change game pace
- Change `PIPE_GAP` to make gaps larger or smaller

### Performance Issues
- Close other browser tabs
- Check your device's performance
- Reduce canvas size in the component props

## 📝 Development

### Adding New Features
The codebase is well-structured for extensions:
- Game logic in the `update` function
- Rendering in the `draw` function
- Input handling in separate event listeners
- Microphone logic in dedicated functions

### Code Style
- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Maintain consistent formatting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the original Flappy Bird game
- Built with modern web technologies
- Thanks to the React and TypeScript communities

## 🎮 Have Fun!

Enjoy playing Flappy Bird with your voice! If you encounter any issues or have suggestions, please open an issue on GitHub.
