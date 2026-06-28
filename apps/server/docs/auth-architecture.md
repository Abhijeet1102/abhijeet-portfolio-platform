# Phase 4: Auth & CMS Architecture

## Authentication Flow
1. User logs in -> Server validates password (bcrypt).
2. Server generates JWT AccessToken (15m) and RefreshToken (7d).
3. AccessToken returned in payload, RefreshToken set in secure, HttpOnly cookie.
4. On AccessToken expiry, client calls `/auth/refresh` to rotate tokens.

## Role-Based Access Control (RBAC) Matrix
| Module | SUPER_ADMIN | ADMIN | EDITOR | VIEWER |
|---|---|---|---|---|
| Users | CRUD | Read | None | None |
| Projects | CRUD | CRUD | Create, Read, Update | Read |
| Blogs | CRUD | CRUD | Create, Read, Update | Read |
| Settings | CRUD | Read | None | None |

## API Contracts
- `POST /api/v1/auth/register` -> Create user
- `POST /api/v1/auth/login` -> Validate & return tokens
- `POST /api/v1/auth/refresh` -> Rotate tokens
- `POST /api/v1/auth/logout` -> Invalidate session
- `GET /api/v1/auth/me` -> Get current user
- `PATCH /api/v1/auth/profile` -> Update user details
