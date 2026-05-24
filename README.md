# KONBIT

**Konekte. Tèt ansanm. Pou nou vanse.**

A two-platform ecosystem connecting the global Haitian diaspora with investment and education opportunities.

---

## 🌐 Two Platforms in One

### KONBIT GROWTH
Tokenized business equity marketplace — diaspora invests in Haitian and diaspora-connected businesses via revenue share and equity tokens on Polygon blockchain.

### KONBIT LEARN
Education marketplace with smart learning features — anyone can teach courses, gift learning globally, and track progress with AI-generated flashcards and spaced repetition.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Supabase (PostgreSQL + Auth) |
| Blockchain | Polygon (ERC-20 tokens) |
| Payments | Stripe Connect |
| Styling | Tailwind CSS |
| Hosting | Vercel |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation

```bash
# Clone the repo
git clone https://github.com/AlekThermezy/KONBIT.git
cd KONBIT

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Then fill in your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
KONBIT/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── lib/                    # Utilities (Supabase, Stripe, etc.)
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript definitions
├── supabase/
│   ├── migrations/             # Database schema
│   └── seed.sql               # Sample data
├── contracts/                  # Solidity smart contracts
└── docs/                      # Platform specifications
```

---

## 📖 Documentation

- [Platform Spec](./docs/SPEC.md)
- [Smart Learning Features](./docs/SMART_LEARNING.md)
- [Growth Platform & Tokenization](./docs/GROWTH_UI_TOKENIZATION.md)
- [Diaspora Business Map](./docs/DIASPORA_BUSINESS_MAP.md)

---

## 🎯 Roadmap

| Phase | Feature |
|-------|---------|
| 1 | Landing page + waitlist |
| 2 | Supabase schema + seed data |
| 3 | Growth browse + campaign pages |
| 4 | Learn browse + course player |
| 5 | User dashboard |
| 6 | Smart contract integration |
| 7 | Payment flows |
| 8 | Public launch |

---

## 💡 Vision

**For ALL nations, ALL people.**

KONBIT connects the global Haitian diaspora with opportunities to invest in and learn from each other. Whether you're in Brooklyn, Port-au-Prince, Montreal, or Paris — KONBIT is your platform to grow together.

---

## 📧 Contact

**Platform:** KONBIT
**Slogan:** Konekte. Tèt ansanm. Pou nou vanse.

---

*Built with Vintage OPEXA*