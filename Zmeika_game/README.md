# 🐍 Snake Game

A classic "Snake" game built using pure JavaScript (Vanilla JS), HTML5, and CSS3. This project is fully responsive and optimized for both desktop and mobile devices.

## 🚀 Features

-   **Full Responsiveness:** The game layout automatically adapts to any screen size.
-   **Dual Control System:** 
    -   **Desktop:** Arrow keys on the keyboard.
    -   **Mobile:** On-screen touch controls.
-   **Dynamic Speed:** Snake speed increases as you consume food.
-   **In-Browser Testing:** Built-in unit tests to verify game logic directly in the browser.
-   **Clean Architecture:** Game logic (State) is separated from visual representation (Render), making the code extensible and easy to test.

## 📂 Project Structure

-   `index.html` — The main game file.
-   `myJS.js` — Game logic, movement handling, and collision detection.
-   `MyStyles.css` — Visual styling and responsive layout.
-   `tests.html` — A dedicated page for running automated logic tests.

## 🛠 How to Run

1.  Download all project files into a single folder.
2.  **To Play:** Open `index.html` in any modern web browser.
3.  **To Test:** Open `tests.html` to see the automated logic test report.

## 🧪 Testing

The project includes tests for the following modules:
-   **Boundary Checks:** Ensuring the snake detects when it hits a wall.
-   **Self-Collision:** Verifying the snake detects when it hits its own body.
-   **Direction Logic:** Preventing illegal 180-degree turns.
-   **Growth Mechanics:** Confirming the snake grows correctly after eating.

## 📱 Controls

-   **Up:** `Up Arrow` key or `▲` button.
-   **Down:** `Down Arrow` key or `▼` button.
-   **Left:** `Left Arrow` key or `◀` button.
-   **Right:** `Right Arrow` key or `▶` button.

---
Developed for educational purposes as a clean implementation of game logic in Vanilla JavaScript.
