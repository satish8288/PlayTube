# 🎬 PlayTube

![Status](https://img.shields.io/badge/Status-Under%20Development-orange)

A YouTube-inspired backend application built with Node.js, Express.js, and MongoDB. It provides REST APIs for user authentication, video management, subscriptions, likes, comments, and media uploads using Cloudinary.

> 🚧 This project is currently under development. New features are being added regularly.

## 🚀 Features

- 👤 User Authentication (JWT)
- 🎥 Video Upload & Management
- ☁️ Cloudinary Integration
- ❤️ Like Videos
- 💬 Comment System
- 🔔 User Subscriptions
- 📦 RESTful APIs
- 🔒 Protected Routes
- ⚡ Redis Caching
- 📨 BullMQ Background Jobs

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Redis
- BullMQ
- Multer
- bcrypt

---

## 📂 Project Structure

```
src/
├── config/
├── controllers/
├── db/
├── middlewares/
├── models/
├── pipelines/
├── queues/
├── routes/
├── services/
├── utils/
└── workers/
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/satish8288/PlayTube.git
```

### Go to Project Folder

```bash
cd PlayTube
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create a `.env` file in the root directory.

Example:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection

ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=your_redis_url
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Run Worker

```bash
npm run worker
```

---

## 📡 API Modules

- Authentication
- Users
- Videos
- Likes
- Comments
- Subscriptions

---

## 📦 Dependencies

- Express
- Mongoose
- JWT
- Multer
- Cloudinary
- Redis
- BullMQ
- bcrypt

---

## 👨‍💻 Author

**Satish Bhardwaj**

GitHub: https://github.com/satish8288

---

## ⭐ Support

If you found this project useful, don't forget to ⭐ the repository.
