# jQuery Drum Kit 🥁

An interactive web-based Drum Kit application built with jQuery. This app allows users to play various drum and synth sounds using their keyboard, mouse, or touch gestures on mobile devices.

## 🚀 Features

- **Multi-platform Control**: Supports physical keyboard input (keys A, S, D, F, G, H, J, K, L, Q, W, E, R, T, Y).
- **Mobile Friendly**: Fully responsive design with touch event support (`touchstart`) for seamless mobile play.
- **Visual Feedback**: Animated key highlighting providing immediate visual cues upon interaction.
- **Live Testing**: Integrated browser-based test suite using QUnit.

## 🛠 Tech Stack

- **HTML5** (including Audio API)
- **CSS3** (Flexbox, Media Queries, Transitions)
- **jQuery 2.2.4**
- **QUnit** (for browser-based testing)

## 🎮 How to Use

1. Open `index.html` in any modern web browser.
2. Press the corresponding keys on your keyboard, click with your mouse, or tap on your screen.
3. Create your own rhythms and beats!

## 🧪 Testing

The project includes "live" tests that don't require any server or Node.js environment.

To run the tests:
1. Open the `tests.html` file in your browser.
2. View the report verifying core functionalities:
   - Correct class activation during playback.
   - Sound stopping and style removal.
   - Handling of non-existent keys.

*Note: Tests include a mock for `audio.play()` to bypass browser autoplay policies.*

## 📱 Responsiveness

The interface automatically adjusts for various screen sizes:
- **Desktop**: Full-sized keys with clear typography.
- **Tablets/Phones**: Compact grid layout with optimized font sizes for long sound names (e.g., "BUMBLEBASS") to ensure text remains in a single line.
- **Touch Optimization**: Disabled text selection and removed tap delays for the most responsive touch experience.

---
Created as part of a portfolio to demonstrate DOM manipulation, event handling, and responsive design skills.
