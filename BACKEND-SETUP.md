# Backend Quick Setup

## 1. Install dependencies

```bash
npm install
```

## 2. Configure env

Copy `.env.example` to `.env` and keep:

```env
PORT=3000
```

## 3. Start backend

```bash
npm start
```

Backend endpoints:
- `GET /api/health`
- `POST /api/contact`

Submitted inquiries are saved to `data/contact-inquiries.json`.
