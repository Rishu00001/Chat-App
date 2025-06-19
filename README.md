# weChat 💬

A full-stack **real-time chat application** built using the **MERN stack** and **Socket.IO** for seamless messaging, presence tracking, and media sharing.  
This app is mobile + desktop responsive and provides a modern chat experience with core features like private chat, profile pictures, typing indicators, and more.

---

## 🚀 Live Demo

👉 [https://wechat-22ij.onrender.com/](https://wechat-22ij.onrender.com/)

---

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite  
- **Backend**: Node.js, Express.js  
- **Real-Time Communication**: Socket.IO  
- **Authentication**: JWT  
- **Database**: MongoDB (Mongoose)  
- **Media Storage**: Cloudinary  
- **Deployment**: Render

---

## ✨ Features

- ✅ One-to-One Private Chat  
- ✅ Typing Indicator (with debouncing)  
- ✅ Online/Offline User Status  
- ✅ Profile Picture Upload & Preview  
- ✅ Join/Leave Notifications  
- ✅ Chat History  
- ✅ Image Sharing  
- ✅ Emoji Support  
- ✅ User Search  
- ✅ Shimmer Loading UI  
- ✅ Fully Responsive (Mobile + Desktop)  
- ✅ JWT Protected Routes (Profile, Chat, etc.)

---

## 🧠 Upcoming Features

- Group Chats  
- Delivered / Seen Indicators  
- Delete Messages  
- Clear Chat  
- User Bio Section  
- Message Pagination (Lazy Loading)

---

## ⚙️ Architecture & Workflow

- Backend structured using modular Express routes + Socket.IO integration  
- Frontend built using Redux slices, reusable components & Tailwind for styling  
- JWT stored in localStorage for protected routes  
- Cloudinary used to handle image uploads efficiently  
- All sockets handle events like `connect`, `disconnect`, `emit`, `broadcast`, `io.emit`

---

## 🧩 Challenges Faced & Solutions

- **Typing Indicator Flooding**: Solved using **debounce** for controlled event emission  
- **Socket Reconnection**: Page refresh triggers automatic reconnection and rejoining  
- **Presence Sync**: Online/offline status updated in real time  
- **Image Upload**: Cloudinary integration with preview before upload  
- **Auth Protection**: JWT implementation on both frontend and backend routes

---

## 📚 Resources Used

- YouTube Tutorials  
- ChatGPT (for logic & debugging help)  
- Official Docs (Socket.IO, MongoDB, JWT, Express)  
- StackOverflow & Google 💪

---

## 📸 Screenshots

_Add screenshots or screen recordings here if available — e.g., typing indicator, image upload, chat UI on mobile and desktop._

---

## 🧪 Getting Started Locally

Follow the steps below to run both frontend and backend locally on your machine:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/weChat.git
cd weChat
