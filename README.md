<div align="center">

# 🏥 SympCheck Helper

### Your AI-Powered Healthcare Consultation Companion

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/tanishq-ctrl/sympcheck-helper/issues)
[![Stars](https://img.shields.io/github/stars/tanishq-ctrl/sympcheck-helper?style=social)](https://github.com/tanishq-ctrl/sympcheck-helper/stargazers)


![Project Demo](https://via.placeholder.com/800x400?text=SympCheck+Helper+Demo)

</div>

---

## 📋 Overview

SympCheck Helper is a modern healthcare consultation chatbot that leverages the power of DeepSeek V3 API and Supabase to provide intelligent health-related assistance. Built with cutting-edge technologies, it offers a seamless and intuitive experience for users seeking health information and support.

<div align="center">

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

</div>

## ✨ Features

<div align="center">

| Core Features | Status |
|--------------|--------|
| 🔍 **Symptom Checker** | Ready | 
| 💡 **Health Tips & FAQs** | Ready | 
| 🏥 **Provider Search** | In Progress |
| 💊 **Medication Reminders** | In Progress |
| 🌍 **Multilingual Support** | Ready | 

</div>

## 🛠️ Tech Stack

### Frontend Powerhouse
- **⚡ Vite**: Lightning-fast development environment
- **⚛️ React**: Robust UI component library
- **📘 TypeScript**: Enhanced code reliability
- **🎯 shadcn-ui**: Beautiful, accessible components
- **🎨 Tailwind CSS**: Utility-first styling

### Backend & Database
- **🔥 Supabase**: Real-time database & authentication
- **🧠 DeepSeek V3 API**: Advanced AI processing
- **📦 Node.js**: Optional backend services

## 📦 Database Schema

<details>
<summary>Click to expand database structure</summary>

### Users Table
```sql
users (
    user_id: uuid primary key,
    name: text,
    email: text unique,
    language_preference: text,
    health_preferences: jsonb,
    created_at: timestamp with time zone
)
```

### Symptom Logs
```sql
symptom_logs (
    log_id: uuid primary key,
    user_id: uuid references users(user_id),
    symptoms: text,
    bot_response: jsonb,
    created_at: timestamp with time zone
)
```

### Reminders
```sql
reminders (
    reminder_id: uuid primary key,
    user_id: uuid references users(user_id),
    medication_name: text,
    dosage: text,
    reminder_time: timestamp with time zone,
    status: text
)
```
</details>

## 🚀 Quick Start

### Prerequisites
```bash
Node.js v14+
npm or yarn
Supabase account
DeepSeek V3 API key
```

### Installation Steps

1️⃣ Clone the repository
```bash
git clone https://github.com/tanishq-ctrl/sympcheck-helper.git
cd sympcheck-helper
```

2️⃣ Install dependencies
```bash
npm install
# or
yarn install
```

3️⃣ Configure environment
```bash
cp .env.example .env
```

4️⃣ Launch development server
```bash
npm run dev
# or
yarn dev
```

## 🔒 Environment Setup

Create `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

## 🤝 Contributing

<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔮 Roadmap

- [ ] Wearable Device Integration
- [ ] Health Analytics Dashboard
- [ ] Telehealth Consultations
- [ ] Emergency Services
- [ ] Health Records Management

## 💌 Support

<div align="center">

Need help? Contact us at [tanishqprabhu20@gmail.com](mailto:tanishqprabhu20@gmail.com)

[![Follow on LinkedIn](https://img.shields.io/badge/LinkedIn-Follow-blue)](https://www.linkedin.com/in/tanishq-prabhu-b71467166/)



Built with ❤️ by [Tanishq Prabhu](https://github.com/tanishq-ctrl)

</div>
