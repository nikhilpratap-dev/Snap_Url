# SnapURL ⚡

> **A Modern, Guest-First URL Shortener & QR Code Generator with Real-Time Analytics.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-success?style=for-the-badge&logo=vercel)](https://snap-url-pi.vercel.app/)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

🔗 **Live Application:** [https://snap-url-pi.vercel.app/](https://snap-url-pi.vercel.app/)

---

## 📖 Overview

**SnapURL** transforms long, cluttered links into clean, memorable, and secure short URLs in seconds. 

Built with a **Guest-First Philosophy**, users can shorten links and download high-contrast QR codes immediately without any mandatory sign-up. When users choose to create an account, their links seamlessly synchronize to the cloud with **real-time click tracking** and private multi-session link management.

---

## ✨ Features

- ⚡ **Guest-First Shortening**: Shorten long URLs instantly with zero mandatory registration.
- 📲 **Client-Side QR Code Engine**: Generates 320px high-contrast QR codes directly in the browser with 1-click PNG downloads.
- 📊 **Real-Time Click Analytics**: Track total visits and clicks for every shortened link when logged in.
- 🗄️ **Smart Dual Storage**:
  - **Guest Mode**: Recent links stored safely in browser `localStorage`.
  - **Cloud Mode**: Links securely mapped to user accounts in MongoDB with complete privacy and account isolation.
- 🔒 **Enterprise-Grade Security**:
  - **Dual JWT Strategy**: Short-lived Access Token (15m) + Rotating Refresh Token (7d) in `httpOnly`, `sameSite: strict` cookies.
  - **Automatic Token Refresh**: Axios response interceptor automatically handles 401 token renewals seamlessly in the background.
  - **Abuse Prevention**: Rate-limiting via `express-rate-limit` (30 links per 15 minutes per IP).
  - **Payload Validation**: Strict Joi schema validation for all request bodies and parameters.
  - **Security Headers**: Hardened with `helmet` and custom CORS policies.
- 📧 **Resilient Email Verification & Recovery**:
  - Automated verification and password reset workflows powered by Nodemailer.
  - Self-service **Resend Verification Link** option with 1-click helper prompts if an email is missed or expired.
- 👁️ **Polished UI/UX**:
  - Dark-mode glassmorphic interface built with **React 19** and **Tailwind CSS v4**.
  - Interactive **Show / Hide Password** toggle on both Sign In and Sign Up forms.

---

## 🛠️ Tech Stack

**Frontend**
- **React 19** + **Vite**
- **Tailwind CSS v4**
- **Axios** (with Bearer request interceptors & 401 auto-refresh)
- **`qrcode`** (offline client-side rendering)

**Backend**
- **Node.js** (ES Modules)
- **Express 5**
- **MongoDB** with **Mongoose 9**
- **JSON Web Tokens (JWT)** & **bcrypt** (12 salt rounds)
- **Joi** validation schemas
- **Nodemailer** for email delivery
- **Helmet**, **cors**, **cookie-parser**, and **express-rate-limit**

---

## 📁 Project Structure

```text
Snap_Url/
├── Backend/
│   ├── app.js                          # Express app entry & middleware pipeline
│   ├── .env.example                    # Sample environment variables
│   ├── package.json
│   └── src/
│       ├── config/mongo-config.js      # MongoDB connection
│       ├── errorHandler.js             # Centralized error handler & custom AppErrors
│       ├── middlewares/validate.js     # Joi validation middleware
│       ├── common/                     # Email config, JWT utils, DTO base classes
│       └── module/
│           ├── auth/                   # Auth routes, controllers, models & services
│           └── shortUrl/               # URL shortening, redirection, and DAO
└── Frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── apis/                       # Axios API service endpoints
        ├── components/                 # Navbar, UrlForm, RecentLinks, AuthModal, etc.
        ├── context/AuthContext.jsx     # Authentication state & session restoration
        ├── pages/HomePage.jsx          # Main landing dashboard
        └── utils/axiosInstance.js      # Axios instance with auto-refresh interceptor
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher) and npm
- MongoDB (local instance on `mongodb://localhost:27017` or MongoDB Atlas URI)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/nikhilpratap-dev/Snap_Url.git
cd Snap_Url
```

### 2. Configure the Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory using `.env.example`:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/Snap_Url_Db
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
ACCESS_SECRET_EXPIRES=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
REFRESH_SECRET_EXPIRES=7d

# SMTP Configuration (Optional - links print to terminal console in development)
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SMTP_FROM_USER=SnapURL
SMTP_FROM_EMAIL=your_email@gmail.com
```

Start the backend:
```bash
npm run dev
```

### 3. Configure and Start the Frontend
Open a new terminal from the root folder:
```bash
cd Frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and communicate with the backend on `http://localhost:3000`.

---

## 📡 API Overview

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|:---:|
| `GET` | `/health` | Health check probe | ❌ |
| `POST` | `/api/auth/register` | Register an account | ❌ |
| `POST` | `/api/auth/login` | Log in and receive JWT tokens | ❌ |
| `POST` | `/api/auth/resend-verification` | Resend verification email link | ❌ |
| `GET` | `/api/auth/verify-email/:token` | Verify email address | ❌ |
| `POST` | `/api/auth/refresh-Token` | Rotate and refresh access token | ❌ (via cookie) |
| `POST` | `/api/auth/forgot-Password` | Start password recovery | ❌ |
| `PUT` | `/api/auth/reset-Password/:token` | Reset password using valid token | ❌ |
| `GET` | `/api/auth/me` | Get current authenticated user profile | ✅ Bearer |
| `POST` | `/api/auth/logOut` | Invalidate refresh token & log out | ✅ Bearer |
| `POST` | `/api/create` | Shorten a long URL (Rate limited: 30 / 15m) | ⚠️ Optional (Guest friendly) |
| `GET` | `/api/create/my-links` | List saved links with click counts | ✅ Bearer |
| `DELETE`| `/api/create/my-links/:id` | Delete a saved link | ✅ Bearer |
| `GET` | `/:id` | Redirect to original long URL & track clicks | ❌ |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/nikhilpratap-dev/Snap_Url/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Developed by <a href="https://github.com/nikhilpratap-dev">Nikhil Pratap</a>
</p>
