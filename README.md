# Seesaw Project

A pure JavaScript physics simulation showing torque and balance. Click the plank to drop weights and see real-time physics in action.

## Key Features
- **Interactive**: Click to drop random weights.
- **Real Physics**: Calculates torque (Weight x Distance) to rotate the plank.
- **Save System**: Game state saves automatically (localStorage).
- **Responsive**: Works on mobile and desktop.
- **Feedback**: Drops have different sounds and colors based on weight.

## Design Decisions & Thought Process

These are the main choices I made during development:

### 1. Pure JavaScript (No Frameworks)
**Why:** To show I can build complex logic without helping tools. It keeps the Code clean and fast.

### 2. Percentage Positioning (%)
**Why:** Pixel values broke on mobile.
**Solution:** I convert logical positions (physics) to percentages (visual). This makes the seesaw look good on all screen sizes.

### 3. LocalStorage
**Why:** It's frustrating to lose progress on refresh.
**Challenge:** Saving HTML elements is hard, so I save the *data* (weight, position) and rebuild the scene when the page loads.

### 4. Animation Feel
**Why:** Real physics felt too fast or jerky.
**Decision:** I used a 1.5s visual transition. It's not "real-time" physics for movement, but it looks much smoother and heavier.

### 5. Rotation Limit (30°)
**Why:** If the plank spins too much, it looks broken.
**Decision:** I capped the angle at 30 degrees. You still see who is winning, but the UI stays neat.

## Trade-offs & Limitations

Things I couldn't finish or chose not to do:

### 1. Fixed Plank Length
**Limitation:** The physics math assumes a 600px plank.
**Impact:** It works fine because I convert it for the UI, but changing the "physics size" would require a code rewrite.

### 2. No Weight Removal
**Limitation:** You can't remove single weights, only Reset All.
**Reason:** Selecting small moving objects on a phone is hard. I focused on the main "dropping" mechanic first.

### 3. Sound Autoplay
**Limitation:** Browsers block sounds until the user interacts.
**Mitigation:** I added code to catch errors so the app doesn't crash if the first sound fails.

### 4. Overlapping Weights
**Limitation:** Weights can pile up on top of each other.
**Reason:** Real collision physics (stacks) would be too complex for this time limit. The torque math still works perfectly.

## AI Disclosure

I used AI assistance for **one specific part**:
- **Commit `c307e53`**: I asked AI to rename my variables (e.g., `val` -> `torqueValue`) and organize CSS colors to make the code easier to read.
- **Everything else** (Physics, Logic, Responsive Design, Animations) is **100% my own work**.

## How to Run
1. Open `index.html` in any browser.
2. Click the plank to play.
