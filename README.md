# Whale Math

**[Play Whale Math](https://datazoems.github.io/whale-math/)**

A free, touch-friendly browser game for learning with humpbacks, orcas, and answer
bubbles. Works in current iPad Safari and desktop browsers. No account, ads,
tracking, dependencies, or installation.

## Play

A friendly whale swims in with a problem. Tap one of four answer bubbles. Both
correct and incorrect answers reveal the equation and an animated explanation:

- **Addition:** humpbacks and orcas start in separate groups, then swim together.
- **Subtraction:** whales start together; the orcas leave and the humpbacks remain.
- **Multiplication:** equal groups combine into the total.
- **Division:** the total is shared into equal groups; the answer is the number
  of whales in each group.

Every illustrated whale represents exactly one. Even larger problems show the
full total, not a capped sample. Empty groups are explicitly labeled zero.
Use **Show the result**, **Replay whales**, and **Next problem** at your own pace.
There is no timer or penalty for incorrect answers.

## Practice settings

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
  appeared. Answers are shuffled independently in either mode.
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
With reduced motion, the initial whale groups remain still until you tap
**Show the result**; no automatic animation is required.

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
