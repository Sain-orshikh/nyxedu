# NyxEdu - Educational Platform

A modern educational platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Clean, professional design with Tailwind CSS
- **TypeScript Support**: Full type safety and better developer experience
- **Fast Development**: Uses Turbopack for lightning-fast development builds

## Getting Started

This project uses **pnpm** as the package manager.

### Prerequisites

Make sure you have Node.js and pnpm installed on your system.

### Installation

1. Navigate to the project directory
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `pnpm dev` - Start the development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

## Project Structure

```
nyxedu/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── components/
│       ├── Navbar.tsx        # Navigation component
│       ├── Footer.tsx        # Footer component
│       └── index.ts          # Component exports
├── public/                   # Static assets
├── package.json             # Project dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── .npmrc                  # pnpm configuration
```

## Built With

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Fast, disk space efficient package manager

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
