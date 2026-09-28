# Experiment 1.3.1: Secure Authentication Mechanism using JSON Web Tokens (JWT)

| Lab Information | Details |
| :--- | :--- |
| **Course** | Full Stack Development II |
| **Experiment Index** | Experiment 1.3.1 |
| **Topic** | Secure Authentication Mechanism using JSON Web Tokens (JWT) |
| **Target Directory** | `exp3` |

---

## 1. Aim
To design and implement a secure authentication system using JSON Web Tokens (JWT) for user login and session management in a modern web application.

## 2. Objectives
1. Understand the core principles of stateless authentication versus stateful session management.
2. Implement cryptographic token creation, signing, and verification using native Web Crypto API (HMAC-SHA256).
3. Demonstrate token-based session management across client storages (`localStorage` and `sessionStorage`).
4. Inspect, decode, and utilize token claims to protect routes and transmit `Authorization: Bearer <token>` HTTP headers.
5. Simulate security scenarios including token expiry and payload tampering.

## 3. Course Outcomes (CO) Mapped
- **CO1 (BT1 - Remember):** Recall fundamental concepts of HTTP requests, authentication protocols, and web security.
- **CO2 (BT2 - Understand):** Understand the structure of JSON Web Tokens (Header, Payload, Signature) and the trade-offs of stateless architectures.
- **CO3 (BT3 - Apply):** Apply client-side token storage, expiration checks, role-based access control (RBAC), and Bearer token attachment to API requests.

---

## 4. Theory & Technical Overview

### 4.1 Stateful vs. Stateless Authentication
| Feature | Traditional Session-Based | JWT Token-Based (Stateless) |
| :--- | :--- | :--- |
| **Session State** | Stored on server memory / Redis | Stored purely on client; verified via signature |
| **Horizontal Scalability** | Requires sticky sessions / distributed DB | Highly scalable; any server can verify independently |
| **Resource Overhead** | High memory usage on server | Minimal server load; small computational cost for crypto |
| **Cross-Domain / Microservices** | Difficult with cookies | Seamless via standard `Authorization: Bearer` headers |

### 4.2 Anatomy of a JSON Web Token (RFC 7519)
A JWT consists of three parts separated by dots (`.`):
$$\text{JWT} = \text{base64Url(Header)} \ .\ \text{base64Url(Payload)} \ .\ \text{base64Url(Signature)}$$

1. **Header (JOSE):**
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```
2. **Payload (Claims):**
   ```json
    {
      "sub": "usr_01",
      "uid": "ADM_1001",
      "name": "Administrator",
      "role": "admin",
      "iat": 1772990000,
      "exp": 1772990300
    }
   ```
3. **Signature:**
   Calculated using HMAC-SHA256:
   $$\text{Signature} = \text{HMACSHA256}(\text{base64Url}(\text{Header}) + "." + \text{base64Url}(\text{Payload}),\ \text{secret})$$

### 4.3 Client Storage Comparison
- **`localStorage`:** Persists across browser tabs and system reboots. Immune to CSRF when sent in headers, but vulnerable to XSS if malicious scripts execute.
- **`sessionStorage`:** Scoped strictly to the active browser tab. Clears on tab close, offering tighter security for shared computers.
- **`HttpOnly Cookie`:** Ideal production approach when protected with `SameSite=Strict` and `Secure` flags, preventing JavaScript access altogether.

---

## 5. Implementation Procedure
1. **User Credential Validation:** Check user email and password against verified accounts.
2. **Cryptographic Token Issuance:** Upon successful authentication, serialize claims, compute HMAC-SHA256 with secret key, and return the compact token.
3. **Client Storage:** Store the token in the selected storage (`localStorage` or `sessionStorage`).
4. **Token Inspection & Decoding:** Parse claims (`name`, `role`, `exp`) on the client without contacting the server.
5. **Request Authorization:** Attach `Authorization: Bearer <token>` to API calls.
6. **Stateless Verification & RBAC:** Server evaluates signature integrity, expiration timestamp, and user permissions before granting access.

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Steps
```bash
# Navigate to experiment folder
cd exp3

# Install dependencies (React, Vite, Lucide-React)
npm install

# Start the Vite development server
npm run dev
```

Visit the local server URL displayed in your terminal (typically `http://localhost:5174`).

---

## 7. Demo Accounts for Evaluation
| Role | Name | Email | Password | Allowed Protected Routes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Administrator | `admin@fsd.edu` | `password123` | `/api/profile`, `/api/admin/metrics`, `/api/academic/evaluation` |
| **Student** | Rohan Sharma | `rohan@fsd.edu` | `password123` | `/api/profile` |
| **Faculty** | Dr. Neha Verma | `faculty@fsd.edu` | `password123` | `/api/profile`, `/api/academic/evaluation` |

---

## 8. Viva Voce Questions & Answers
**Q1: What does the 'S' in HS256 stand for?**  
*Answer:* HS256 stands for **HMAC with SHA-256**, a symmetric cryptographic algorithm using a shared secret key for signing and verification.

**Q2: Can anyone read the payload of a standard JWT?**  
*Answer:* Yes. JWTs are encoded using Base64Url, not encrypted. Anyone can decode and inspect the payload claims. Hence, confidential secrets like passwords or API keys must never be placed in a JWT payload.

**Q3: How does the server detect if a JWT was modified in transit?**  
*Answer:* The server recomputes the HMAC-SHA256 hash using its private secret and the received Header + Payload. If even a single bit in the payload changed, the calculated hash will not match the signature on the token, and the server rejects it with HTTP 401 Unauthorized.

**Q4: How do you invalidate a stateless JWT before its expiration?**  
*Answer:* Because the server does not hold session state, common strategies include:
1. Setting short token lifetimes with refresh tokens.
2. Maintaining a lightweight token blacklist / revocation list in Redis for revoked token IDs (`jti`).
3. Rotating the server signing secret or incrementing a user `tokenVersion` stored in the database.
# fullstack2
