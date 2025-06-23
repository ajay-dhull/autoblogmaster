# NewsHub - Complete Setup Guide

## ✅ Quick Setup (Recommended)

### 1. Download & Extract
- Download the project files to your computer
- Extract to a folder (e.g., `C:\Users\YourName\newshub` or `~/newshub`)

### 2. Install Dependencies
Open terminal/command prompt in the project folder and run:

```bash
npm install
```

### 3. Start the Application
Run any of these commands based on your system:

**For All Systems (Recommended):**
```bash
npm run dev
```

**Windows Command Prompt:**
```cmd
dev.bat
```

**Windows PowerShell:**
```powershell
.\dev.ps1
```

**Mac/Linux/Git Bash:**
```bash
./dev.sh
```

**Universal Node.js Starter:**
```bash
node start-dev.js
```

### 4. Access Your Website
Open your browser and go to: **http://localhost:5000**

---

## 🔧 Troubleshooting

### Windows "NODE_ENV not recognized" Error
If you see this error with `npm run dev`:
```
'NODE_ENV' is not recognized as an internal or external command
```

**Solution 1:** Use the Windows batch file:
```cmd
dev.bat
```

**Solution 2:** Use PowerShell:
```powershell
.\dev.ps1
```

**Solution 3:** Use the universal starter:
```bash
node start-dev.js
```

### Port Already in Use
If port 5000 is busy:
1. Close any other applications using port 5000
2. Or restart your computer to free up the port

### Database Connection Issues
The application is pre-configured with a working database. If you see database errors:
1. Check your internet connection
2. Run: `npm run db:push` to sync the database

---

## 📁 Project Structure

```
newshub/
├── client/           # React frontend (your website)
├── server/           # Backend API
├── shared/           # Common code
├── .env              # API keys (pre-configured)
├── dev.bat           # Windows batch file
├── dev.ps1           # PowerShell script
├── dev.sh            # Mac/Linux script
├── start-dev.js      # Universal starter
└── README.md         # Documentation
```

---

## 🚀 Features Working Out of the Box

✅ **Content Generation**: Automatic news articles every few hours  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  
✅ **Search & Filter**: Find articles by category or keywords  
✅ **Contact Form**: Send emails directly from the website  
✅ **Modern UI**: Clean, professional design  
✅ **Fast Loading**: Optimized for speed  

---

## 🔑 API Keys

All API keys are pre-configured in the `.env` file:
- News APIs for global and India news
- AI service for content enhancement
- Image services for article photos
- Email service for contact forms

---

## 💡 Development Tips

### Making Changes
- Frontend code: `client/src/` folder
- Backend code: `server/` folder
- The server automatically restarts when you save changes

### Building for Production
```bash
npm run build
npm run start
```

### Database Operations
```bash
npm run db:push    # Sync database schema
```

---

## 📞 Support

For technical issues or questions:
- Email: contact.neuraxon@gmail.com
- The application includes comprehensive error handling and logging

---

## 🎯 What You Can Do Now

1. **View Your Website**: Go to http://localhost:5000
2. **Read Articles**: Browse through auto-generated news content
3. **Test Contact Form**: Try sending a message
4. **Customize Content**: Modify pages in `client/src/pages/`
5. **Add Features**: Extend the application as needed

The application is production-ready and can be deployed to any hosting service that supports Node.js applications.