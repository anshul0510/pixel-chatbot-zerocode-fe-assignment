# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
# 🤖 AI ChatBot Application

An AI-powered chatbot web app built using **React + TypeScript + Vite** (frontend) and **Flask + Python** (backend). The chatbot supports voice input, prompt templates, chat export, light/dark mode, and session-based authentication.

---

## 🧠 Features

- 🔐 User login and registration with session expiry
- 🌙 Light/Dark mode toggle
- 🎤 Voice input (multi-language)
- 🧠 Powered by OpenRouter (ChatGPT-style API)
- 💬 Chat templates
- 📄 Export chat history
- 🧹 Clear all chat
- ⚙️ Fully responsive design

---

## 🏗️ Project Architecture

```txt
📦 project-root/
├── frontend/                 # React + Vite frontend
│   ├── pages/                # Pages (Chat, Login, Register)
│   ├── components/           # Header, InputBox, MessageBubble, etc.
│   ├── hooks/                # useSessionRedirect
│   ├── context/              # ThemeContext
│   ├── styles/               # Theme, global styles
│   └── AppRouter.tsx         # Route management
│
├── backend/                  # Python Flask backend
│   ├── app.py                # Main Flask app
│   ├── .env                  # API keys & configs
│   └── requirements.txt      # Flask & openrouter dependencies
│   └── constants.py          # Flask & openrouter constant
│   └── validation.py         # Flask validation
│
└── README.md

🚀 Getting Started
🔧 Backend Setup (Flask)
    cd backend/
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

Set your .env file with your API key:
  OPENROUTER_API_KEY=your_api_key

Run the server:
  python app.py
  Server running at http://localhost:5000/chat

🌐 Frontend Setup (React + Vite)

  cd frontend/
  npm install
  npm run dev
  App opens at http://localhost:5173

Make sure vite.config.ts has the correct proxy setup:
  proxy: {
    '/chat': 'http://localhost:5000',
  }

🔑 Authentication Flow
  New users register via /register

  Login sets a 30-minute session

  Protected routes (e.g., /chat) require active session

  Logout and session expiry redirect to login

🧾 Main Files & What They Do
🔹 Frontend
    File	                       Description
    Chat.tsx	                    Main chat logic: send messages, voice input, show bubbles
    Login.tsx /                   Register.tsx	Handle auth flow with session storage
    Header.tsx	                  Theme toggle, logout
    useSessionRedirect.tsx	      Redirects to login if no active session
    themeContext.tsx	            Light/dark mode logic
    AppRouter.tsx	                All app routes including protection for /chat

🔹 Backend
    File	                       Description
    app.py                      	Flask app exposing /chat API
    .env	                        Stores secret keys (e.g., OpenRouter API key)
    requirements.txt	            Lists all Python dependencies

📸 Demo Screenshots
  Can be find under frontend/public/

📤 Export / Clear Chat
  Export chat as .txt or .json
  Clear conversation with one click

🧠 LLM Integration
  Powered by OpenRouter (ChatGPT-like models)
  You can swap with OpenAI or HuggingFace APIs by editing app.py

🛡️ Security Notes
  Passwords are hashed (not stored as plain text)
  Session token is stored in localStorage
  Session expires after 30 minutes

📚 Tech Stack
  Frontend	Backend
  React + Vite	Flask
  TypeScript	Python 3
  styled-components	OpenRouter SDK
  react-toastify	python-dotenv
  react-router-dom	flask-cors

✅ Setup Summary
  # Backend
    cd backend && python -m venv venv && source venv/bin/activate
    pip install -r requirements.txt
    python app.py

  # Frontend
    cd frontend && npm install && npm run dev 

👤 Author
  Anshul Bhardwaj
  📧 [workwithanshul05@gmail.com]
  🔗 https://www.linkedin.com/in/work-with-anshul-bhardwaj

