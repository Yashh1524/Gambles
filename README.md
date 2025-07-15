# 🎮 GamBles – Stake-Inspired Betting App(MERN Stack)

**GamBles** is a full-stack betting game platform inspired by Stake.com, built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It features wallet-based betting with a Mines and Dice game, user authentication, wallet tracking, and transaction history — all wrapped in a modern, responsive UI.

> ⚠️ This is a learning project and **not crypto-based**. All funds and bets are simulated with virtual money.

---

🔗 [Demo Video](https://youtu.be/KF0jBhC7FsM)
🔗 [Live Link](https://gambles-gilt.vercel.app/)

## 🚀 Features

- 🔐 JWT-based authentication with secure refresh tokens
- 🧩 Mines game & 🎲 Dice game with profit logic
- 💰 Real-time wallet system and day-wise and bet-wise wallet graph
- 📊 User bet stats and winning streak tracking
- 📤 Deposit/withdraw transactions with Razorpay simulation
- 🛡️ Admin view and user activity logging
- 📱 Fully responsive design using Tailwind CSS

---

## 📦 Tech Stack

- **Frontend:** React, Tailwind CSS, Vite  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (access + refresh tokens)  
- **Payments (Simulated):** Razorpay  
- **Email + OAuth:** Resend, Gmail, GitHub  
- **Docs:** Postman Collection

---

## 📖 API Documentation

Explore the complete Postman API collection here:  
🔗 [GamBles Postman Docs](https://documenter.getpostman.com/view/38024301/2sB2x6kBmn)

### ✨ Highlighted Endpoints

#### 👤 User Routes (`/api/user`)
- `POST /register` – Register new user  
- `POST /login` – Log in with credentials  
- `POST /logout` – Logout session  
- `GET /my-details` – Get logged-in user details  
- `POST /refresh-token` – Refresh access token  
- `POST /resend-verification` – Resend email verification  
- `POST /reset-password` – Request OTP for reset  
- `POST /verify-reset-password-otp` – Verify OTP  
- `POST /set-new-password` – Reset password  
- `GET /get-day-wise-wallet-stats` – Wallet graph data  
- `POST /deposit-money` – Add virtual funds

#### 🕹️ Game Routes (`/api/games`)
- `POST /mines/start-mine` – Start new mines game  
- `PATCH /mines/reveal-tile` – Reveal a tile  
- `POST /mines/end-mine` – End and cash out  
- `POST /dice/roll-dice` – Roll dice and win/lose

#### 🎯 Bet Routes (`/api/bet`)
- `POST /create-bet` – Record a game bet  
- `GET /fetch-bets-by-user` – Get all user bets  
- `POST /fetch-user-bet-by-game` – Filter bets by game  
- `GET /get-user-totalwin-and-winningstreak` – Stats summary  

#### 💸 Transaction Routes (`/api/transaction`)
- `POST /create-transaction` – Deposit/Withdraw money  
- `GET /get-all-transaction-by-user-id` – Get full transaction history  
- `POST /update-transaction-status` – Admin: update payout status

#### 🧾 Razorpay Routes (`/api/razorpay`)
- `POST /create-deposit-order` – Start a simulated Razorpay order  
- `POST /verify-deposit-payment` – Verify simulated deposit  
- `POST /withdraw-payout-razorpay` – Simulated Razorpay payout

---

## 📁 Environment Variables

### 🔐 Backend – `server/.env`

```env
MONGODB_URI=your_mongo_uri
SECRET_KEY_ACCESS_TOKEN=your_access_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_secret
NODE_ENV=development

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000

RESEND_API_KEY=your_resend_api_key

SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SENDER_EMAIL=your_sender_email

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAYX_ACCOUNT_NUMBER=your_account_number
````

### 💻 Frontend – `client/.env`

```env
VITE_API_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 🛠️ Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/YashBhut1524/Gambles
cd Gambles

# 2. Set up frontend
cd client
npm install
cp .env.example .env
# Add your VITE_API_URL and Razorpay Key

# 3. Set up backend
cd ../server
npm install
cp .env.example .env
# Fill out all required keys in .env

# 4. Run development servers
npm run dev     # in /server
npm run dev     # in /client
```

---

## 📸 Screenshots

<div align="center">

  <img src="https://github.com/user-attachments/assets/e0a0bc7f-225a-4985-ae0c-f10d9cb50613" width="30%" />
  <img src="https://github.com/user-attachments/assets/2329804c-3107-46f1-b024-b6bf46269340" width="30%" />
  <img src="https://github.com/user-attachments/assets/7f0e3a44-0ae7-4f81-9cb3-06a48ed411d3" width="30%" />
  <br/>
  <img src="https://github.com/user-attachments/assets/456461e2-ca9b-40c6-9261-294c4b8a9def" width="30%" />
  <img src="https://github.com/user-attachments/assets/3552bf7e-b0e7-4901-8a97-1678483d1a72" width="30%" />
  <img src="https://github.com/user-attachments/assets/56dffe3b-a561-43c5-ba47-6f3e3a857432" width="30%" />


</div>


---

## 🔗 Connect with Me

* **GitHub:** [YashBhut1524](https://github.com/YashBhut1524)
* **LinkedIn:** [linkedin.com/in/yashbhut1524](https://www.linkedin.com/in/yashbhut1524/)
* **Twitter/X:** [@YaShh1524](https://x.com/YaShh1524)
* **Instagram:** [@dev.yashh1524](https://www.instagram.com/dev.yashh1524/)
* **YouTube:** [@yashh\_1524](https://youtube.com/@yashh_1524?si=PzWdorlUq0Mlq5TY)

---

## 🧑‍💻 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Feel free to fork the repo, open issues, or submit pull requests.
All suggestions, features, or improvements are welcome!

```
