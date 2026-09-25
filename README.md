# ReBuilder 📝✨

**ReBuilder** is an AI-powered Full-Stack Resume Builder web application. It simplifies the process of crafting professional resumes by leveraging OpenAI to generate or refine content, while allowing users to export their beautiful resumes directly to PDF.

## 🚀 Features

- **AI-Assisted Content Generation:** Utilize the power of OpenAI to help write professional summaries, bullet points, and experience descriptions.
- **Real-Time Preview:** Build your resume using a modern, responsive UI built with React and Tailwind CSS.
- **PDF Export:** Seamlessly download your finished resume as a polished PDF via `html2pdf.js`.
- **Local Database:** Securely stores your resume data using an efficient SQLite database (`better-sqlite3`).

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS & PostCSS
- **Icons:** Lucide React
- **Utilities:** Axios (API calls), html2pdf.js (PDF generation)

### Backend
- **Framework:** Node.js & Express.js
- **Database:** SQLite (`better-sqlite3`)
- **AI Integration:** OpenAI API (`openai`)
- **Other:** CORS, dotenv, UUID

## 📂 Project Structure

This project is set up as a monorepo with both the frontend and backend in the same repository.

```
ReBuilder/
├── frontend/      # React + Vite frontend
├── backend/       # Node.js + Express backend (includes SQLite DB)
└── package.json   # Root package file with helper scripts
```

## ⚙️ Getting Started

### Prerequisites
- Node.js installed on your machine
- An OpenAI API Key (for the AI generation features)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SANJAY-S-max/ReBuilder.git
   cd ReBuilder
   ```

2. **Install dependencies:**
   You can install dependencies for both frontend and backend.
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   In the `backend` directory, create a `.env` file based on `.env.example`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

### Running the Application

From the root directory, you can start the development servers using the provided scripts:

- **Start Frontend and Backend (separately):**
  - Frontend: `npm run dev:frontend`
  - Backend: `npm run dev:backend`
  
*(Check the root `package.json` for additional helpful commands!)*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
