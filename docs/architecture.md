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

## Implementation Decisions

### Presentation tier

- Replace each placeholder component with the shared API client plus loading, empty, error, and success states.

### Smallest Safe Implementation Order

1. **Data tier**
	- Add the required schema fields and validation needed by the failing tests.
	- Preserve existing seed data behavior and compatibility.
	- Ensure validation prevents invalid records from being persisted.
2. **Logic tier**
	- Implement activity validation, creation, and listing.
	- Implement team validation, creation, and listing.
	- Implement leaderboard aggregation and ranking.
	- Implement user lookup by email.
	- Implement activity-pattern workout suggestions.
	- Include a `reason` field explaining each workout recommendation.
	- Return deliberate 4xx responses for invalid input and unknown users instead of 500-level errors.
3. **Presentation tier**
	- Replace each placeholder component with an implementation that uses the shared API client.
	- Add loading states for data-fetching operations.
	- Add empty states when no data is returned.
	- Add error states for failed API requests.
	- Add success states for completed operations.
	- Keep frontend behavior aligned with the API contract.
4. **Validation order**
	- Run data-tier tests after schema changes.
	- Run API tests after service-layer implementation.
	- Run frontend tests after UI implementation.
	- Finish with backend and frontend build verification.

## Test Plan

1. Verify MongoDB is running before executing integration tests.
2. Establish a failing baseline:
	- `npm test --prefix octofit-tracker/backend`
	- `npm test --prefix octofit-tracker/frontend`
3. Validate data-tier changes:
	- `npm run test:data --prefix octofit-tracker/backend`
4. Validate API-layer changes:
	- `npm run test:api --prefix octofit-tracker/backend`
5. Validate presentation-tier changes:
	- `npm test --prefix octofit-tracker/frontend`
6. Perform full regression testing:
	- `npm test --prefix octofit-tracker/backend`
	- `npm test --prefix octofit-tracker/frontend`
7. Verify production readiness:
	- `npm run build --prefix octofit-tracker/backend`
	- `npm run build --prefix octofit-tracker/frontend`
8. Confirm all tests pass and both applications build successfully before submission.
