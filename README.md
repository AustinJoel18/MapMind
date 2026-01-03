# MapMind – World Map Memory Game

MapMind is an interactive web application that challenges users to name as many countries as they can remember by looking at a world map.  
It supports multiple users, tracks named countries per user, and visually displays progress.

---

## 🚀 Features

- 🗺️ Interactive world map
- 👤 Multiple users with custom colors
- 🌎 Track countries named by each user
- ➕ Add new users dynamically
- ❌ Remove users (with cascading delete)
- 🧠 Memory-based geography learning
- 🗄️ PostgreSQL database integration

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- EJS (Embedded JavaScript templates)

**Backend**
- Node.js
- Express.js

**Database**
- PostgreSQL

**Other Tools**
- Git & GitHub
- dotenv (environment variables)

---

## 📂 Project Structure

```

MapMind/
│
├── database/
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
│
├── public/
│   └── styles/
│       └── main.css
│
├── views/
│   ├── index.ejs
│   └── new.ejs
│
├── countries.csv         # Country data
├── index.js              # Main server file
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

````

---
## 🧪 Sample Users

The project comes with sample users:

* Austin (teal)
* Joel (powderblue)

You can add or remove users from the UI.

---

## 🧠 How the Game Works

1. Select a user
2. Look at the world map
3. Type country names you remember
4. Each correct country is saved for that user
5. Duplicate entries are prevented
6. Each user has their own progress

---

## 🧹 Database Constraints

* Unique country per user
* Foreign key relationships
* Cascade delete on user removal

---
🔗 Live Website
https://mapmind-v022.onrender.com/
---
<img width="1891" height="920" alt="image" src="https://github.com/user-attachments/assets/b7e75ecb-aa8a-4e4e-9828-f7bc5fa37ec8" />


