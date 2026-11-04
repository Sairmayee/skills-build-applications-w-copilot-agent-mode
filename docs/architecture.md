# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

### Data tier

- Extend MongoDB schemas with the fields required by the failing tests.
- Preserve existing seed data behavior and backward compatibility.
- Add validation rules at the model level to enforce required fields.

### Logic tier

- Implement activity creation, validation, and retrieval services.
- Implement team creation, validation, and retrieval services.
- Implement leaderboard aggregation and ranking logic.
- Implement user lookup and personalized workout recommendation generation.
- Add explicit 4xx error responses for invalid requests and unknown users.

### Presentation tier

- Replace placeholder React components with API-integrated components.
- Use the shared API client for all backend communication.
- Support loading, empty, success, and error UI states.
- Keep frontend behavior aligned with backend API contracts.

### Configuration

- Use only the approved service ports:
- Backend: `8000`
- Frontend: `5173`
- MongoDB: `27017`

## Test plan

1. Verify MongoDB is running before executing integration tests.
2. Run focused data-tier tests after schema and validation changes.
3. Run backend API tests after implementing service-layer functionality.
4. Run frontend tests after replacing placeholder components.
5. Re-run backend and frontend test suites after each completed tier.
6. Perform final verification using `npm test --prefix octofit-tracker/backend` and `npm test --prefix octofit-tracker/frontend`.
7. Confirm both frontend and backend builds succeed before submission.

Focused commands:

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend`
- API command: `npm run test:api --prefix octofit-tracker/backend`
- Frontend command: `npm test --prefix octofit-tracker/frontend`
- Backend build command: `npm run build --prefix octofit-tracker/backend`
- Frontend build command: `npm run build --prefix octofit-tracker/frontend`
