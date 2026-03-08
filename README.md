# cubing.spec

A spec-driven CFOP learning companion for Rubik's cube speedsolving. Built to support my journey from beginner method to sub-2-minute solves using the CFOP method.

## What is this?

This project serves as a personal reference for learning and practicing CFOP (Cross, F2L, OLL, PLL) — the dominant speedcubing method used in competitive solving. The app provides algorithm grids, interactive visualizations, practice timers, and solve tracking to make learning efficient and fun.

Development follows a specification-first approach using **spec-kit** principles, with AI-assisted implementation via **GitHub Copilot agent mode**.

## Motivation

I first learned to solve a cube using the beginner method from [JPerm](https://www.youtube.com/@JPerm) (Dylan Wang) and progressed to CFOP through tutorials from [CubeHead](https://www.youtube.com/@CubeHead) (Milan Struyf). This app helps consolidate that learning with quick visual references and practice tools. I'm not a cubing expert — just a beginner aiming for consistent sub-2-minute solves while experimenting with modern web development workflows.

## CFOP Primer

CFOP is a four-step 3x3 speedcubing method developed around 1981 and is responsible for most [world record](https://www.worldcubeassociation.org/results/records?event_id=333&show=mixed+history) times over the last decade (sub-5 seconds is wild! 🤯).

- **Cross** - Solve four edge pieces on the bottom face (intuitive)
- **F2L** (First Two Layers) - Insert edge-corner pairs into four slots (intuitive, 4 core cases)
- **OLL** (Orientation of Last Layer) - Orient last layer pieces (algorithmic, 9 cases for 2-look)
- **PLL** (Permutation of Last Layer) - Position last layer pieces (algorithmic, 6 cases for 2-look)

Start with the essential four algorithms (Sune, AntiSune, T-Perm, Ua-Perm), then gradually expand to the full 2-look suite for better efficiency.

## Practice Strategies

Repetition is the key theme: consistent reps build recognition and muscle memory.

### Solve with algorithms in mind

- Practice with focused weekly goals (for example: improve one F2L case set or PLL recognition).
- Start slow for accuracy and finger placement, then increase speed gradually.
- Repeat each algorithm 10-20 times in one session to build muscle memory.
- Observe piece movement during execution to strengthen visual + logical understanding.
- Work on efficient finger tricks and reduce unnecessary cube rotations.
- If you make a mistake, re-scramble and repeat the same case with cleaner execution.

### Solve with random scrambles

- Scramble randomly and practice one stage at a time (Cross, F2L, OLL, or PLL).
- Set measurable targets (for example: Cross under 8 moves, F2L under 30 seconds).
- Use a timer for algorithms and full solves to track progress over time.

## Built With

- **Cubing knowledge** from [Milan Struyf](https://www.youtube.com/@CubeHead) (CubeHead) and [Dylan Wang](https://www.youtube.com/@JPerm) (JPerm)
- **[cubing.js](https://github.com/cubing/cubing.js)** framework from Lucas Garron for cube graphics, animations, and algorithm visualization
- **React 19** and **TypeScript 5.9** for modern reactive UI
- **Vite 7** for fast development and optimized builds
- **GitHub Copilot agent mode** for AI-assisted development
- **spec-kit** methodology for specification-driven implementation
- Deployed on **GitHub Pages**

## Features

- ✅ **Algorithm grids** - Visual reference for 2-look OLL/PLL and beginner cases
- ✅ **Interactive tooltips** - Algorithm notes on hover for learning context
- ✅ **Solve visualization** - cubing.js TwistyPlayer modal for animated algorithm playback
- ✅ **Practice timer** - Scramble generation + solve timer with session tracking
- ✅ **Stats persistence** - localStorage-based solve time history across sessions
- ✅ **Custom scramble generator** - Local 20-move rule-based generation (no worker dependencies)

## Development

```sh
cd cfop-app
npm install
npm run dev
```

Dev server runs at http://127.0.0.1:5173/cubing.spec/

### Production Build

```sh
npm run build
```

Preview production build locally:
```sh
npm run preview
```

## Acknowledgments

Huge thanks to the cubing community educators who make this learning journey accessible, and to the cubing.js project for providing such a powerful toolkit for cube visualization and manipulation. This project wouldn't exist without their generous knowledge sharing.

## License

MIT License - see [LICENSE](LICENSE) for details.

Note: 
- Cubing algorithms are mathematical sequences in the public domain. 
- This project uses [cubing.js](https://github.com/cubing/cubing.js) (MPL-2.0) for visualization.

---

**Status**: Active development • Feature 006 (custom scramble generator) in testing phase
