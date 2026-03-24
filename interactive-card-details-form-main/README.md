# Frontend Mentor - Interactive Card Details Form Solution

This is my solution to the [Interactive card details form challenge](https://www.frontendmentor.io/challenges/interactive-card-details-form-XpS8cKZDWw) on Frontend Mentor.

## Overview

### What users can do

- Fill in card details and see the card preview update in real time.
- Submit the form with validation for blank and invalid fields.
- View a completed state after a valid submission.
- Reset back to the form by clicking Continue.
- Use the page on mobile and desktop layouts.

### Built with

- Semantic HTML5
- CSS custom properties
- Mobile-first responsive CSS
- CSS Grid and Flexbox
- Vanilla JavaScript

### Design notes

This implementation keeps the original Frontend Mentor structure and behavior, with an upgraded modern visual style:

- Layered background gradients and subtle texture.
- Glass-like form panel and completion panel.
- Refined input focus states and polished button interactions.
- Lightweight entrance animations with reduced-motion support.

## Validation behavior

- Cardholder name: required.
- Card number: required, digits only, 16 digits.
- Expiry month and year: required, month must be 01 to 12.
- CVC: required, 3 digits.

Error messages are shown inline and invalid inputs get a red border.

## Project structure

- [index.html](index.html) - Page markup
- [style.css](style.css) - Styling and responsive layout
- [script.js](script.js) - Real-time updates, validation, and state transitions
- [images](images) - Challenge assets
- [design](design) - Reference design images

## Run locally

1. Open this folder in VS Code.
2. Open [index.html](index.html) in your browser (or use Live Server).

## Links

- Solution URL: Add your Frontend Mentor solution link here
- Live Site URL: Add your deployed site link here

## Author

- Frontend Mentor: [@AmosStack](https://www.frontendmentor.io/profile/AmosStack)
