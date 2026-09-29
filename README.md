# KHAN POKER

Найзуудтайгаа онлайнаар тоглодог, зөвхөн **үнэгүй виртуал жетон** ашигладаг
real-time multiplayer Texas Hold'em веб апп. Бодит мөнгөний мөрийтэй тоглоом
БИШ — мөнгө байршуулах, жетон худалдах/татах, crypto/банкны төлбөр, cash-out
ЗАДГАЙ Ч байхгүй.

**Архитектур:** React + Vite static SPA (GitHub Pages дээр hosting) +
Supabase (PostgreSQL, Auth, Realtime, Presence, Broadcast, Edge Functions).
Next.js, Vercel, тусдаа Node.js сервер ашигладаггүй.

Дэлгэрэнгүй: [`docs/architecture.md`](docs/architecture.md),
[`docs/database.md`](docs/database.md),
[`docs/game-state-machine.md`](docs/game-state-machine.md),
[`docs/security.md`](docs/security.md),
[`docs/test-plan.md`](docs/test-plan.md).

## Хурдан эхлэх

### 1. GitHub repository үүсгэх, push хийх

```bash
git init && git add . && git commit -m "KHAN POKER Phase 1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/khan-poker.git
git push -u origin main
```

### 2. Supabase project бэлтгэх

`docs/deployment.md`-г бүрэн дагаж:
1. Supabase project үүсгэ.
2. `supabase/migrations/0001_init.sql`-ийг SQL Editor-т ажиллуул.
3. Authentication → Email provider идэвхжүүл, Redirect URL нэм.
4. `Project URL` болон `anon public` key-ээ ав.

### 3. Environment variables

```bash
cp .env.example .env.local
```

`.env.local`-д Supabase-аас авсан утгуудаа бөглөнө (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`). Local хөгжүүлэлтэд `VITE_APP_BASE_PATH=/` гэж
үлдээ (GitHub Pages дээр л repo нэртэй path хэрэгтэй).

### 4. Суулгах, ажиллуулах

```bash
npm install
npm run dev
```

http://localhost:5173 → бүртгүүлээд (`/register`) `/lobby` руу шилжинэ.

### 5. Тест

```bash
npm run typecheck
npm run lint
npm test            # unit (Vitest + Testing Library)
npm run test:e2e    # e2e (Playwright, preview server-ийг өөрөө эхлүүлнэ)
npm run build       # production build
```

### 6. GitHub Pages deploy

1. Repository → Settings → Pages → Source: **GitHub Actions**.
2. Repository → Settings → Secrets and variables → Actions → Variables:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_BASE_PATH`
   (жишээ нь `/khan-poker/`).
3. `main` руу push хийхэд `.github/workflows/deploy-pages.yml` автоматаар
   typecheck → lint → test → build → deploy хийнэ.

Дэлгэрэнгүй алхам алхмаар: [`docs/deployment.md`](docs/deployment.md).

## Одоогоор хэрэгжсэн боломжууд (Phase 1)

- Email/password бүртгэл, нэвтрэх, гарах, нууц үг сэргээх, и-мэйл баталгаажуулалт
- Client-side route protection (Zustand auth store + React Router guard)
- Хэрэглэгчийн нэр давхардахгүй байдал (RPC шалгалт), display name, avatar сонголт
- Бүртгүүлмэгц 10,000 үнэгүй жетон, rating 1000, level 1, XP 0 (DB trigger)
- Responsive nav, Lobby shell, Rules, Settings, Profile, Leaderboard хуудас
- Cinematic dark/gold дизайн систем (Tailwind tokens), `prefers-reduced-motion` дэмжлэг
- Бүх Phase 1-6-ийн DB schema + RLS policy (`supabase/migrations/0001_init.sql`)
- GitHub Pages deploy workflow + SPA deep-link fallback (`404.html`)
- Unit test (validation, UI), e2e smoke test (auth урсгал)

## Хэрэгжсэн боломжууд (Phase 2 — Multiplayer Room System)

- `create-room` / `join-room` / `leave-room` / `update-room-player` /
  `kick-room-player` / `start-room-game` Edge Functions (JWT баталгаажуулалт,
  SECURITY DEFINER Postgres RPC, row-level locking)
- Лоби: room жагсаалт/шүүлтүүр, 6-тэмдэгт код (ойлгомжгүй 0/O/1/I/L хассан)
  code-оор нэгдэх, нууц үгтэй өрөө
- Waiting room: 2-8 тоглогчийн oval ширээ, seat солих, ready toggle, host
  эрх (kick, "start game")
- Supabase Realtime Presence (multi-tab dedupe), Broadcast emoji reactions
- Room chat (rate-limit, mute, report), `password_hash`-ийн багана-түвшний
  хамгаалалт (`rooms_safe` view)

## Хэрэгжсэн боломжууд (Phase 3 — Texas Hold'em Poker Engine)

- `src/features/poker/engine/` — бүрэн цэвэр, deterministic, framework-гүй
  TypeScript poker engine (React/Supabase/Zustand/browser API/network-ээс
  тусгаарлагдсан, random/цаг хугацааг dependency injection-оор авна)
- Бүрэн 9 hand category-ийн үнэлгээ (exhaustive C(7,5) харьцуулалт), Ace-low
  straight, tie/kicker харьцуулалт
- No-Limit Hold'em дүрэм: heads-up тусгай blind дараалал, minimum/short
  all-in raise reopen semantics, давхарласан main/side pot, odd-chip
  хуваарилалт, fold-win/showdown settlement
- `startHand`/`applyAction`/`advanceState` — гадаад API, street progression
  автомат (all-in runout-ийг deterministic байдлаар шууд river хүртэл
  дэлгэнэ)
- Internal (server) vs public (player/spectator) state задаргаа
  (`serialization.ts`) — deck/бусдын hole cards хэзээ ч алдагдахгүй
- 160 unit тест (`tests/unit/poker-*.test.ts`), үүнд 25 санамсаргүй
  (property-based) бүрэн-гарын симуляци chip conservation/invariant шалгалттай
- `hand_results` хүснэгт + `hands.encrypted_deck`/`server_seed_hash`-ийн
  багана-түвшний хамгаалалт (`0003_poker_engine_prep.sql`)

Дэлгэрэнгүй: [`docs/game-state-machine.md`](docs/game-state-machine.md)
(Mermaid diagram), [`docs/test-plan.md`](docs/test-plan.md).

## Дараагийн үе шат (Phase 4)

- Phase 3 engine-ийг Supabase Edge Functions (`start-hand`, `submit-action`,
  `finish-hand`) дотор import хийж холбох
- Realtime тоглоомын sync (Broadcast), ширээний UI (карт анимаци, action bar)
- Reconnect: authoritative snapshot дахин татах

Дараа нь Phase 5 (profile/leaderboard/friends/moderation UI холболт, avatar
Storage upload), Phase 6 (tournament, polish, a11y, security review, e2e,
deployment docs) дараалан үргэлжилнэ (`docs/architecture.md`
§implementation-order).

## Аюулгүй байдал

`docs/security.md`-г үзнэ үү — server-authoritative зарчим (Edge Functions),
RLS бодлого, secrets менежмент.

<!-- deploy-trigger: 2026-09-29 (Supabase шинэ project руу шилжсэний дараах redeploy) -->
