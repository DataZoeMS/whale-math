# Whale Math

**[Play Whale Math](https://datazoems.github.io/whale-math/)**

A free, touch-friendly browser game for learning with humpbacks, orcas, and answer
bubbles. Works in current iPad Safari and desktop browsers. No account, ads,
tracking, dependencies, or installation.

## Play

A humpback with broad tail flukes, a long moving flipper, and a pleated belly
swims in from offscreen carrying the problem. Once it arrives, four answer
bubbles rise into view and gently float **above** the whale. Tap a bubble to
answer; the bubbles hold still while you explore the explanation. Each new
problem repeats the swim-in entrance. Answer bubbles always run from **lowest
to highest**, left to right.

Both correct and incorrect answers reveal the equation and an animated explanation:

- **Addition:** humpbacks and orcas start in separate groups, then swim together.
- **Subtraction:** whales start together; the orcas leave and the humpbacks remain.
- **Multiplication:** equal groups combine into the total.
- **Division:** the total is shared into equal groups; the answer is the number
  of whales in each group.

Every illustrated whale represents exactly one. Even larger problems show the
full total, not a capped sample. Empty groups are explicitly labeled zero.
Use **Show the result**, **Replay whales**, and **Next problem** at your own pace.
There are no time limits or penalties for incorrect answers.

## Optional learning tools

Open either tool below the whale without restarting the problem or changing
your score:

- **Helper table:** the symbol and values automatically follow the current
  addition, subtraction, multiplication, or division problem. Find the first
  number down the side and the second across the top to look up the answer.
  Headers stay visible as you scroll, and selected focus numbers are highlighted.
  Tap a number down the left side to highlight its entire row. Tap another to
  move the highlight, or the same number again to clear it. Row headers also
  support keyboard activation. The selection clears when a new problem starts.
  Division includes the larger starting numbers needed for your selected facts;
  dashes mark non-whole-number division or subtraction below zero. The current
  problem is repeated above the table.
- **Scratch pad:** draw with a finger, Apple Pencil, or mouse, or choose a
  **Humpback stamp** or **Orca stamp** and tap to place one whale at a time.
  Mix stamps and drawing to build your own groups. **Undo** removes the last
  stroke or stamp; **Clear pad** removes everything. A count shows how many
  humpbacks and orcas you have stamped.

Both tools can stay open between problems. Scratch work survives closing the
pad, changing questions, and resizing the browser, but is not saved after a
reload or sent anywhere. For keyboard stamping, choose a whale, focus the pad,
use arrow keys to position the stamp, and press Enter or Space.
Touch gestures that start inside the pad are reserved for drawing and stamping,
including on iPad Safari. Scrolling and zooming outside the pad remain available.

The optional **practice timer** counts up only when you press **Start**.
**Stop** pauses it; Start resumes from the paused time. **Reset** stops the timer
and returns it to zero. It continues across questions and setting changes, never
limits the time to answer, and resets when the page is reloaded.

## Practice settings

**Start practice** and **Close** stay together at the top of the settings panel,
even when you scroll. Start practice applies your selections; Close dismisses
the panel without changing your current practice.

- Choose **Ocean blue** (the default), **Sea glass**, **Coral reef**, or
  **Classic rose**. Each palette adapts to your device's light/dark appearance
  and is saved with your other practice settings.
- Choose any combination of the four operations. Addition and subtraction are
  selected initially.
- The range defaults to **10**, with options **5, 10, 12, and 20**.
- Addition totals and subtraction starting numbers stay within the range.
- Multiplication factors and division answers go up to the selected range.
  Range 10 therefore includes `10 x 10 = 100` and `100 / 10 = 10`.
- Select one or more **focus numbers**, such as **2 and 4**. The focus number is
  the second operand: the number added, subtracted, multiplied by, or divided by.
  With no individual numbers selected, all valid numbers are included.
- **Sequential** orders facts by operation (addition, subtraction,
  multiplication, division), focus number, and then ascending first operand.
- **Shuffle** randomizes the same set, without repeats until every fact has
  appeared. Answer bubbles stay in ascending numerical order in either mode.
- Subtraction never produces negative answers. Division always produces whole
  numbers and never divides by zero. Zero facts are included where valid.

Settings are stored only in this browser's local storage. Session progress
resets when you start a new practice or reload. If storage is unavailable, a
visible notice explains that settings cannot be saved.

## Accessibility and devices

Large touch targets work without hover or dragging. All controls support
keyboard navigation, and feedback and explanation text use live announcements.
Correct and incorrect choices use text and different borders, not just color.
Portrait, landscape, and small screens use responsive layouts.

The game follows the device's light/dark appearance and reduced-motion setting.
With reduced motion, the whale and answer bubbles appear immediately and stay
still. The initial explanation groups remain still until you tap
**Show the result**; no automatic animation is required. Keyboard focus moves
from the new problem to the answer bubbles when they become available.

## Development and hosting

The game is a self-contained `index.html`, including original SVG whale art.
Open it directly, or serve this folder:

```console
python -m http.server 8765 --bind 127.0.0.1
```

Then visit `http://localhost:8765/`.

Run the dependency-free arithmetic and explanation tests with Node.js 18+:

```console
node --test game.test.cjs
```

The tests cover all supported ranges, four unique answer choices, focus
filtering, order and shuffle behavior, zero cases, invalid settings, and exact
whale identities/counts before and after every explanation.

GitHub Pages serves the root of the `main` branch. Pushes to `main` publish
updates automatically; `.nojekyll` disables unnecessary Jekyll processing.
