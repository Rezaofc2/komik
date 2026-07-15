# Komiku - Setup Guide

## Prerequisites
- Node.js 18+ installed
- Google OAuth credentials

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google Identity Services API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for local development)
     - `https://your-domain.com` (for production)

3. **Setup Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local` and add your Google Client ID:**
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

5. **Run the development server:**
   ```bash
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Features

- ✅ Google OAuth Login
- ✅ Bottom Navigation (Home, Search, Genre, History)
- ✅ Manhwa/Manga/Manhua filtering
- ✅ 28+ Genres
- ✅ Search functionality
- ✅ Reading history
- ✅ Dark theme UI
- ✅ Mobile responsive

## Project Structure

- `/app` - Next.js pages and routes
- `/components` - Reusable React components
- `/lib` - Utilities and context providers
- `/app/api` - API routes for data fetching

## Deployment

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variable `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in Vercel dashboard
4. Deploy!

## User Flow

1. User visits site → Redirected to login
2. User signs in with Google
3. User is redirected to home page
4. User can browse, search, and read komik
5. Reading history is saved to localStorage
6. User can logout via the logout button in navbar
