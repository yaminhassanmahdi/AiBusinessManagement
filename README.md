# SetupOnce - AI-Powered Business Management Platform

A comprehensive SaaS business management platform with AI-powered features, product management, order tracking, and team collaboration.

## Features

- **Product Management**: Categories, attributes, variants, and inventory tracking
- **Order Management**: Complete order lifecycle with customer management
- **Team Collaboration**: Project and task management
- **AI Chat Interface**: Natural language commands and queries
- **Multi-tenant Architecture**: Secure business isolation
- **Real-time Dashboard**: Business analytics and insights

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel-ready

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/90b2376b-0a5f-418d-9a61-48c99b81f3bd) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Copy .env.example to .env and update with your values
cp .env.example .env
```

Required variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

### Vercel Deployment

1. **Connect to GitHub**: Push this repository to GitHub
2. **Deploy to Vercel**: 
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. **Deploy**: Vercel will automatically deploy your app

### Environment Variables for Vercel

In your Vercel project settings, add these environment variables:

```
VITE_SUPABASE_URL=https://xzrivvulxejkhunnewte.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cml2dnVseGVqa2h1bm5ld3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODkyMDYsImV4cCI6MjA2OTQ2NTIwNn0.OXIQZ-UzS5zT23qPygj0olv779QnM0hN-tcfBk1PYvg
```

## Database Setup

The project uses Supabase with the following features:
- PostgreSQL database with Row Level Security (RLS)
- Authentication and user management
- Real-time subscriptions
- File storage

Database migrations are included in the `supabase/migrations/` directory.
