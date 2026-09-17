# repo-analyzer

A FastAPI application that mines GitHub commits, extracts features, trains a simple ML model, and predicts commit risk.

## Phase 0 Overview

This is the single-process foundation with clean structure and a working end-to-end pipeline. Future phases will add Celery, Docker, and resilience patterns.

## Setup

### Prerequisites

- Python 3.10+
- PostgreSQL (optional; SQLite works for local testing)
- GitHub OAuth App credentials

### 1. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Authorization callback URL**: `http://localhost:8000/auth/github/callback`
3. Copy the Client ID and Client Secret

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=sqlite:///./repo_analyzer.db
JWT_SECRET=your-secret-key-change-this
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
```

For PostgreSQL (optional):
```
DATABASE_URL=postgresql://user:password@localhost:5432/repo_analyzer
```

### 4. Initialize Database

Tables are auto-created on startup via SQLAlchemy. No migrations needed for Phase 0.

### 5. Run the Server

```bash
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```
Returns `{"status": "ok"}`

### GitHub Login
```
GET /auth/github/login
```
Redirects to GitHub OAuth flow. After callback, returns JWT token.

### Analyze Repository
```
POST /analyze
Headers:
  Authorization: Bearer <jwt_token>
  Content-Type: application/json

Body:
{
  "repo_url": "https://github.com/owner/repo",
  "max_commits": 100
}
```

Response:
```json
{
  "repository_id": 1,
  "total_commits": 50,
  "predictions": [
    {
      "id": 1,
      "commit_id": 1,
      "risk_score": 0.75,
      "label": "high",
      "model_used": "LogisticRegression",
      "created_at": "2026-08-18T10:00:00"
    }
  ]
}
```

## Testing

Run the test suite:
```bash
pytest tests/
```

Run with coverage:
```bash
pytest --cov=app tests/
```

### Test Coverage

- **test_features.py**: Unit tests for feature extraction
  - Normal commit, merge commit, zero files changed, empty message
  - No mocking needed; pure function testing

- **test_routes.py**: Integration tests for endpoints
  - Health check
  - GitHub login redirect
  - Auth-protected analyze endpoint
  - Invalid URL validation

## Database Schema

### users
- `id`: Primary key
- `github_id`: Unique GitHub user ID
- `username`: GitHub username
- `email`: User email (nullable)
- `created_at`: Timestamp

### repositories
- `id`: Primary key
- `owner_id`: FK to users (CASCADE delete)
- `url`: Unique repository URL
- `owner`: Repository owner
- `name`: Repository name
- `created_at`: Timestamp

### commits
- `id`: Primary key
- `repository_id`: FK to repositories (CASCADE delete)
- `sha`: Commit SHA
- `message`: Commit message
- `author`: Commit author
- `additions`: Lines added
- `deletions`: Lines deleted
- `files_changed`: Number of files changed
- `committed_at`: Commit timestamp
- `features`: JSONB with extracted features
- `created_at`: Timestamp
- **Constraint**: UNIQUE(repository_id, sha)

### predictions
- `id`: Primary key
- `commit_id`: FK to commits (CASCADE delete)
- `risk_score`: Float 0-1
- `label`: "high" or "low"
- `model_used`: Model identifier
- `created_at`: Timestamp
- **Constraint**: risk_score BETWEEN 0 AND 1

## Architecture

### Services (Pure Functions)

**mining.py**
- `mine_commits(repo_url, max_commits, github_token)`: Fetches commits via GitHub REST API
- `parse_github_url(url)`: Parses GitHub URLs

**features.py**
- `extract_features(commit)`: Extracts numeric features from commit data
  - additions, deletions, total_churn, files_changed, message_length, is_merge_commit, avg_churn_per_file

**ml.py**
- `train_model(feature_dicts)`: Trains LogisticRegression
  - Handles degenerate case (all same label) with DummyModel
- `predict_risk(model, feature_dict)`: Returns (risk_score, label)
- `generate_risk_labels(feature_dicts)`: Heuristic: high_churn OR many_files → risky

### Routes

**auth.py**
- `GET /auth/github/login`: Redirect to GitHub OAuth
- `GET /auth/github/callback`: Handle OAuth callback, issue JWT

**analyze.py**
- `POST /analyze`: Full pipeline (mine → extract features → train → predict)
  - **Note**: Blocks request thread; Phase 2 will add Celery for async

### Auth

- **JWT (HS256)**: Token-based auth for protected routes
- **Dependency**: `get_current_user` validates token and loads user from DB

## Future Work (Phase 1+)

- Celery for async pipeline execution
- Docker containerization
- Circuit breakers for GitHub API
- Retry logic with exponential backoff
- Better ML model with real bug labels
- Webhook notifications
- Database migrations (Alembic)

## Notes

- **Phase 0 Blocking**: POST /analyze is synchronous. This is intentional for Phase 0.
- **SQLite vs PostgreSQL**: Set DATABASE_URL in .env; app auto-detects and configures.
- **Error Handling**: Routes validate inputs; services raise ValueError on issues.
- **Logging**: Disabled; enable by configuring Python logging if needed.
