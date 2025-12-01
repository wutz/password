# Secure Password Generator

A modern, secure, and user-friendly password generator web application built with React and Tailwind CSS.

![App Screenshot](https://via.placeholder.com/800x400?text=Secure+Password+Generator+Preview)

## Features

- **Secure Generation**: Uses `window.crypto` for cryptographically strong random number generation.
- **Customizable**:
  - Adjustable password length (up to 128 characters).
  - Toggle uppercase, lowercase, numbers, and symbols.
  - Option to exclude ambiguous characters (e.g., 'i', 'l', '1', 'L', 'o', '0', 'O').
- **User Experience**:
  - One-click copy to clipboard.
  - Visual password strength indicator.
  - Dark/Light/System theme support.
  - Multi-language support (English, Chinese, Japanese, German, French).
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Tech Stack

- **Frontend**: React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/password-generator.git
   cd password-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. Open your browser and visit `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT
