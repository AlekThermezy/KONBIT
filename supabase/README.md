# Supabase Database

## Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → SQL Editor
3. Copy the contents of `migrations/001_schema.sql`
4. Run the SQL

## Schema Overview

| Table | Purpose |
|-------|---------|
| `users` | Platform users (instructors, investors) |
| `waitlist` | Pre-launch email capture |
| `courses` | Course listings |
| `lessons` | Individual lessons within courses |
| `enrollments` | User course enrollments |
| `flashcards` | SRS flashcards |
| `certificates` | Completion certificates |
| `streaks` | Daily study streaks |
| `businesses` | Businesses seeking investment |
| `campaigns` | Active investment campaigns |
| `investments` | User investments |
| `gifts` | Gifted courses |
| `connections` | User networking |
| `sector_insights` | Business intelligence data |

## Row Level Security

RLS is enabled on all tables with appropriate policies:
- Public read for published content
- Users manage their own data
- Instructors manage their courses
- Authenticated users have elevated access