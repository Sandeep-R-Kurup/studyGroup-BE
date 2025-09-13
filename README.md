# Study Groups Backend (TypeScript)

Node.js + Express + MongoDB + Redis backend for study group management, goals, activities, leaderboard, and progress tracking.

## Stack

- Node.js / Express / TypeScript
- MongoDB (Mongoose)
- Redis (caching leaderboard & progress)
- JWT Auth (+ optional Google OAuth)

## Setup

1. Install: `npm install`
2. Env file `.env`:

```
MONGO_URI=mongodb://localhost:27017/studygroups
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://127.0.0.1:6379
# Optional Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

3. Run dev: `npm run dev`
4. Default port: 3000

Auth header: `x-auth-token: <JWT>`

---

## Auth

### POST /api/auth/register

Body: `{ "name":"Alice", "email":"alice@example.com", "password":"Passw0rd!" }`
Resp: `{ "token":"<jwt>" }`

### POST /api/auth/login

Body: `{ "email":"alice@example.com", "password":"Passw0rd!" }`
Resp: `{ "token":"<jwt>" }`

---

## Subjects

### GET /api/subjects

Public list.

### POST /api/subjects (auth)

Body: `{ "name":"arrays" }`

---

## Legacy Study Groups (basic)

### POST /api/studygroups (auth)

Body: `{ "name":"Algo", "description":"Prep", "subject":"<subjectId>" }`

### GET /api/studygroups

List all.

### GET /api/studygroups/:id

### POST /api/studygroups/:id/join (auth)

### POST /api/studygroups/:id/leave (auth)

---

## Enhanced Groups (new feature set)

Base: `/api/groups`
Responses follow shape:

```
{
  "success": boolean,
  "message": string,
  "data": any,
  "error?": { code, details? }
}
```

### Create Group

POST /api/groups (auth)
Body:

```
{
  "name":"DSA Sprint",
  "description":"Grinding",
  "members":["invitee1@example.com"]  // optional emails
}
```

Success 201 -> populated group.
Errors: USER_ALREADY_CREATOR

### Add Member

POST /api/groups/:id/member (auth creator)
Body: `{ "email":"user@example.com" }`
Errors: GROUP_NOT_FOUND, FORBIDDEN, USER_NOT_FOUND, USER_ALREADY_MEMBER

### Add Goal

POST /api/groups/:id/goal (auth creator)
Body:

```
{
  "title":"Solve 100 questions",
  "subject":"arrays",
  "metric":"questionsSolved",  // or timeSpent (future)
  "target":100,
  "deadline":"2025-09-30T23:59:59.000Z",
  "recurring":"weekly"         // optional: daily|weekly
}
```

Errors: GROUP_NOT_FOUND, FORBIDDEN, ACTIVE_GOAL_EXISTS

### Record Activity

POST /api/groups/:id/activity (auth member)
Body:

```
{
  "questionId":"<questionId>",
  "status":"solved",
  "timeSpent":420
}
```

Errors: GROUP_NOT_FOUND, FORBIDDEN, NO_ACTIVE_GOAL, GOAL_EXPIRED, DUPLICATE_ACTIVITY

### Leaderboard

GET /api/groups/:id/leaderboard?sort=questionsSolved&page=1&limit=10
Query:

- sort: `questionsSolved` | `timeSpent`
- page, limit (<=50)
- subjects (future extension)
  Resp data:

```
{
  "page":1,
  "limit":10,
  "metric":"questionsSolved",
  "results":[ { "rank":1, "userId":"..", "name":"Alice", "questionsSolved":5, "timeSpent":1234, "lastActivityAt":"..." } ]
}
```

Caching: 60s Redis.

### Progress

GET /api/groups/:id/progress
Updated response (reflects new relative percentage logic):

```
{
  "goal": {
    "id":"...",
    "title":"Solve 100 questions",
    "subjects": ["arrays"],
    "metric":"questionsSolved",
    "target":100,
    "deadline":"2025-09-30T23:59:59.000Z",
    "recurring":"weekly"
  },
  "group": { "size": 4 },
  "totals": { "questionsSolved": 32, "timeSpent": 8400 },
  "progress": {
    "aggregate": 32,              // total solved/time across group (metric-dependent)
    "perMemberAverage": 8,         // raw average solved per member (questionsSolved metric only)
    "relativeAverage": 62.5,       // mean( eachMemberSolved / topSolved ) * 100
    "percentage": 62.5             // displayed % (== relativeAverage for questionsSolved; for timeSpent = aggregate/target * 100 capped)
  }
}
```

Field notes:

- relativeAverage / percentage (questionsSolved): If only one member contributes all solves, each contributing member ratio=1, non-contributors=0. Example: 1 of 2 members solves all => (1 + 0)/2 \* 100 = 50%.
- percentage (timeSpent metric): classic completion = min(100, aggregateTime / target \* 100).
- perMemberAverage omitted for timeSpent metric.

Caching: 60s Redis.

---

## Questions

### POST /api/questions (auth)

Body:

```
{
  "studyGroup":"<groupId>",
  "title":"Two Sum",
  "content":"Find indices...",
  "subject":"arrays"
}
```

### POST /api/questions/:id/answer (auth)

Body: `{ "answer":"..." }`

### GET /api/questions/group/:groupId

---

## Messages

### POST /api/messages/:groupId (auth)

Body: `{ "message":"Hello", "studyGroup":"<groupId>" }`

### GET /api/messages/:groupId (auth)

---

## Error Codes (selected)

- UNAUTHORIZED / FORBIDDEN
- GROUP_NOT_FOUND
- USER_ALREADY_CREATOR
- USER_ALREADY_MEMBER
- ACTIVE_GOAL_EXISTS
- NO_ACTIVE_GOAL
- GOAL_EXPIRED
- DUPLICATE_ACTIVITY
- SERVER_ERROR

Legacy endpoints may return simple `{ msg: "..." }` (normalization pending).

---

## Caching

- Leaderboard & progress keyed by `group:{id}:leaderboard` / `group:{id}:progress` (+ params)
- Invalidation on goal create & activity record.

---

## Postman

Import provided collection JSON. Set variables:

- base_url = http://localhost:3000
- token (auto set after login test script)
- group_id, question_id after creation responses.

---

## Roadmap / Pending

- Subject & metric validation on activity (ensure question subject matches goal subjects)
- Recurring goal reset automation
- Extended leaderboard filters (subjects, time windows, user rank outside page)
- Unified response wrapper for legacy routes
- Security hardening & tests

---

## Scripts

- `npm run dev` (ts-node-dev)
- `npm run build` -> dist (if configured)
