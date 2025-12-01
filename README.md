# Secure Password Generator

A modern, secure, and user-friendly password generator web application built with React and Tailwind CSS.

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
   git clone https://github.com/wutz/password.git
   cd password
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

## Deployment

### Deploy to Cloudflare Pages

Cloudflare Pages is a fast and secure static site hosting platform, perfect for deploying Vite-built React applications.

#### Method 1: Deploy via Cloudflare Dashboard

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Log in to Cloudflare Dashboard**:
   - Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Log in to your account

3. **Create a new project**:
   - Go to **Pages** section
   - Click **Create a project**
   - Choose **Upload assets** (direct upload) or **Connect to Git** (Git integration)

4. **Upload build files**:
   - If choosing direct upload, upload the files from the `dist` directory
   - Set the build output directory to `dist`
   - Click **Deploy site**

#### Method 2: Deploy via Wrangler CLI

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   # or
   bun add -g wrangler
   ```

2. **Log in to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Deploy to Cloudflare Pages**:
   ```bash
   wrangler pages deploy dist
   ```

#### Method 3: Automatic Deployment via Git Integration (Recommended)

1. **Prepare the project**:
   - Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)

2. **Set up in Cloudflare Dashboard**:
   - Go to **Pages** → **Create a project** → **Connect to Git**
   - Select your Git provider and authorize
   - Choose the repository and branch

3. **Configure build settings**:
   - **Framework preset**: Vite
   - **Build command**: `npm run build` or `bun run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (project root)

4. **Deploy**:
   - Click **Save and Deploy**
   - Future pushes to the main branch will automatically trigger deployments

#### Custom Domain

After deployment, you can add a custom domain in your Cloudflare Pages project settings:
- Go to project settings → **Custom domains**
- Add your domain
- Cloudflare will automatically configure DNS and SSL certificates

## License

MIT
