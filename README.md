# Seesaw Physics Simulation

A pure JavaScript interactive seesaw simulation that demonstrates fundamental physics concepts including torque, balance, and rotation. Users click on the plank to drop weighted objects and observe real-time physics calculations.

## Table of Contents
- [Live Demo](#live-demo)
- [Features](#features)
- [Technical Implementation](#technical-implementation)
- [Design Decisions & Thought Process](#design-decisions--thought-process)
- [Development Journey & Challenges](#development-journey--challenges)
- [Trade-offs & Limitations](#trade-offs--limitations)
- [AI Assistance Disclosure](#ai-assistance-disclosure)
- [How to Run](#how-to-run)
- [Project Structure](#project-structure)

## Live Demo
Open `index.html` in your browser to interact with the simulation.

## Features

### Core Functionality
- **Interactive Weight Placement**: Click anywhere on the plank to drop weighted objects
- **Real-time Physics**: Accurate torque calculation and visual rotation based on weight distribution
- **Persistent State**: Game state saved to localStorage and restored on page reload
- **Responsive Design**: Fully functional on mobile and desktop devices

### User Interface
- **Visual Feedback**: Live display of left/right weight totals and current seesaw angle
- **Activity Log**: Recent weight placements tracked in a scrollable log panel
- **Distance Markers**: Visual ruler on the plank showing distance from center (0-5 units each side)
- **Color-coded Weights**: Random vibrant colors with size proportional to weight value

### Controls
- **Pause/Resume**: Freeze the simulation to observe current state
- **Reset**: Clear all weights and restore initial state
- **Sound Effects**: Contextual audio feedback (light/medium/heavy drops, reset sound)

## Technical Implementation

### Physics Engine
The core of this project is a custom physics calculation system:

```javascript
// Torque calculation: Torque = Weight × Distance
function calculateTorque() {
    let leftTorque = 0;
    let rightTorque = 0;
    
    for (let obj of gameState.objects) {
        const torqueValue = obj.weight * obj.distance;
        if (obj.side === 'left') {
            leftTorque += torqueValue;
        } else {
            rightTorque += torqueValue;
        }
    }
    
    return { leftTorque, rightTorque };
}
```

The plank rotation angle is determined by the difference between left and right torques, capped at ±30 degrees for visual clarity.

### Coordinate System
One of the more challenging aspects was implementing a hybrid coordinate system:
- **Logical coordinates**: 600px fixed plank length for physics calculations
- **Visual coordinates**: Percentage-based positioning for responsive layout
- **Conversion formula**: `percentFromCenter = (logicalDistance / 300) * 50`

This allows physics calculations to remain consistent while the UI scales naturally across devices.

### State Management
The application uses a simple but effective state object:

```javascript
const gameState = {
    isPaused: false,
    objects: []  // Array of {weight, distance, side, color}
};
```

Each weight placement is stored with all necessary properties for physics calculations, persistence, and UI rendering.

## Design Decisions & Thought Process

### 1. Percentage-based Positioning
**Decision**: Changed from pixel-based to percentage-based positioning in the responsive design update.

**Rationale**:
- Initial fixed-pixel approach broke on small screens
- Percentage positioning allowed the plank to scale naturally
- Required careful conversion between logical (physics) and visual (UI) coordinate systems
- Maintains physics accuracy while ensuring visual responsiveness

### 2. Animation Timing
**Decision**: Plank rotation uses `1.5s ease-in-out` transition.

**Rationale**:
- Initial faster animations felt jarring
- Slower timing allows users to observe physics cause-and-effect
- Creates more realistic weight-settling sensation
- Found through trial and error (commits show refinements to timing)

## Development Journey & Challenges

### Phase 1: Foundation (Initial Commits)
Started with HTML structure and basic CSS setup. Key decisions:
- Used CSS custom properties (`--color-primary`, `--plank-width`) for maintainability
- Implemented ruler markers manually in HTML (11 markers, 0-5 each side)
- Initial layout with semantic sections (header, ui-panel, simulation-area, controls)

**Challenge**: Getting ruler marker positioning correct required fixing the order (commit `e917091`).

### Phase 2: Core Physics (Days 1-2)
Implemented the physics engine and interactivity:

1. **Click Detection** (commit `59b6825`): Converted click coordinates to logical plank position
   - Challenge: Understanding `offsetX` vs actual click position on scaled elements
   - Solution: Calculate scale factor between visual width and logical 600px width

2. **Weight Generation** (commit `ab93de6`): Random weights with visual representation
   - Challenge: Making weight size visually proportional and aesthetically pleasing
   - Solution: `size = 30 + (weight * SCALE_FACTOR)` with configurable factor

3. **Torque Calculations** (commit `9ae804f`): Core physics implementation
   - Challenge: Correctly tracking which side weights belong to
   - Solution: Store side ('left'/'right') in weight data and use ternary for logical distance sign

4. **Rotation Animation** (commit `e9eed01`): Apply calculated torque to visual rotation
   - Challenge: Finding the right divisor to convert torque difference to degrees
   - Solution: `angle = (rightTorque - leftTorque) / 10` provided good visual feedback

### Phase 3: Polish & Features (Hours 18-22)
Added control features and refinements:

1. **Pause/Reset** (commit `714cb8b`): Game state management
   - Challenge: Ensuring paused state prevents interaction but doesn't break UI
   - Solution: Check `gameState.isPaused` in click handler and update cursor style

2. **UI Weight Display** (commit `ef1ea5f`): Total weight counters
   - Challenge: Updating displays efficiently during torque calculation
   - Solution: Calculate totals during torque calculation loop (avoid double iteration)

3. **LocalStorage** (commit `74b6c38`): Persistence implementation
   - Challenge: Restoring DOM elements from saved data
   - Solution: Replay creation logic with saved properties, including exact positioning

4. **Animation Refinement** (commit `2f4f24e`): Improved drop animation
   - Multiple iterations to find right keyframe values
   - Settled on 3-stage animation (0%, 35%, 100%) for smooth appearance

### Phase 4: Enhancement (Hours 13-16)
Added quality-of-life features:

1. **Sound Effects** (commit `5847fb0`): Audio feedback
   - Challenge: Finding/creating appropriate sounds for different weight classes
   - Solution: Three MP3 files (light/medium/heavy) triggered based on weight thresholds
   - Insight: Added `.catch()` handler for autoplay policy restrictions

2. **Activity Log** (commit `ab59f2a`): User action history
   - Challenge: Displaying meaningful information without clutter
   - Solution: Monospaced font, color-coded sides, prepend for reverse chronological order

### Phase 5: Code Quality & Mobile (Hours 0-2)
Final polish and professional touches:

1. **Code Refactoring** (commit `c307e53`): **AI-ASSISTED**
   - Used AI to suggest better variable names and improve code readability
   - Changed generic names (`diff`, `val`) to semantic names (`diffOfSides`, `torqueValue`)
   - Reorganized CSS color palette for consistency
   - Removed debug console.log statements
   - **Important**: Logic remained unchanged, only naming and organization improved
   - Added favicon manually (SVG triangle representing seesaw)

2. **Angle Display** (commit `a83ebf5`): Added real-time angle indicator
   - Simple addition but completes the physics feedback loop for users

3. **Responsive Design** (commit `c3a9ead`): Mobile compatibility
   - Challenge: Fixed-pixel positioning broke on mobile screens
   - Solution: Complete refactor to percentage-based positioning
   - Updated both creation and loading logic for consistency
   - Added CSS media queries for layout adjustments

## Trade-offs & Limitations

### 1. Fixed Plank Length
**Trade-off**: Physics calculations use a hardcoded 600px plank.

**Impact**: 
- Simplifies calculations but requires conversion layer for responsive UI
- Alternative would be recalculating all physics on window resize (more complex)

### 2. No Weight Removal
**Limitation**: Users can only reset all weights, not remove individual ones.

**Reason**: 
- Time constraint prioritized core features
- Individual removal would require click detection on small moving objects
- Reset functionality provides sufficient control for demonstration purposes

### 3. Sound Autoplay Restrictions
**Limitation**: First sound may not play on some browsers due to autoplay policies.

**Mitigation**: 
- Added `.catch()` handlers to prevent console errors
- Sounds work after first user interaction (pause/reset)
- Could improve with user permission prompt, but avoided for simplicity

### 4. localStorage Versioning
**Limitation**: No migration strategy if state schema changes.

**Impact**: 
- Breaking changes to object structure would require manual clear
- Acceptable for demo project, production would need versioning

### 5. Cubic Bezier (Bounce Effect)
**Limitation**: I intentionally avoided using a complex, spring-like `cubic-bezier` animation.

**Reason**: 
- I experimented with a bouncy bezier curve to simulate spring physics, but it felt too "chaotic" and distracted from the torque concept.
- A smooth `ease-in-out` transition provided a better sense of "heaviness" and stability, making the physics demonstration clearer for the user.
- It was a conscious design choice to prioritize visual clarity over cartoonish motion.

### 6. No Collision Detection
**Limitation**: Weights can overlap on the plank.

**Reason**: 
- Significantly increases complexity (would need 2D physics engine)
- Doesn't impact the core physics demonstration
- Visual overlap is minor and doesn't confuse the torque concept

## AI Assistance Disclosure

In the spirit of transparency required by the assignment, here's exactly where and how AI was used:

### Code Refactoring (Commit `c307e53`) - **AI-ASSISTED**
**What was assisted**: 
- Variable renaming suggestions (e.g., `diff` → `diffOfSides`, `obj` → `weightData` in some contexts)
- CSS color variable organization and naming consistency
- Code comment improvements for clarity
- Identifying and removing debug code

**What was NOT assisted**:
- All physics calculations and logic (100% my own work)
- Architecture and state management design
- Responsive positioning solution
- Animation timing and keyframe values
- HTML structure and semantic organization

**Why I disclose this**: The commit message explicitly states this refactoring was AI-assisted. However, I emphasize that the **core logic, algorithms, and problem-solving** are entirely my own. AI was used as a code quality tool, similar to using a linter or formatter, but for semantic improvements.

### Everything Else - **NO AI ASSISTANCE**
All other commits represent my own work:
- Physics implementation and torque calculations
- Coordinate system and responsive positioning solution
- LocalStorage persistence logic
- Event handling and state management
- Animation implementation and timing refinements
- Sound effect integration
- UI/UX design decisions

**My capability statement**: The commit message in `c307e53` includes: "But i can do it all (little bit slower)." This is important—while AI helped speed up the refactoring, I could (and did for all other features) accomplish this work independently. The entire project demonstrates my understanding of:
- Object-oriented JavaScript patterns
- Event-driven programming
- Physics simulation
- Responsive web design
- Browser APIs (localStorage, Audio)
- CSS animations and transitions

## How to Run

1. Clone or download this repository
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. Click anywhere on the plank to start dropping weights
4. Experiment with different positions to observe torque effects

No build process or dependencies required.

## Project Structure

```
seesaw-simulation/
├── index.html          # Main HTML structure
├── style.css           # Complete styling and animations
├── script.js           # Physics engine and game logic
├── assets/
│   ├── sounds/
│   │   ├── light.mp3   # Sound for light weights (< 4kg)
│   │   ├── medium.mp3  # Sound for medium weights (4-7kg)
│   │   ├── heavy.mp3   # Sound for heavy weights (≥ 8kg)
│   │   └── reset.mp3   # Sound for game reset
│   └── images/
│       └── favicon.svg # Custom seesaw icon
└── README.md           # This file
```

---

**Developer**: Ferhat Yiğit  
**Date**: February 2026  
**Purpose**: Technical interview assignment demonstrating physics simulation, vanilla JavaScript skills, and responsive design

This project showcases my ability to:
- Implement mathematical concepts (torque, rotation) in code
- Build interactive simulations without frameworks
- Make thoughtful design trade-offs
- Write clean, maintainable code
- Solve responsive design challenges
- Manage project complexity through incremental development 
