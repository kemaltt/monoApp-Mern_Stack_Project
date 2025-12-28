# 💰 Mono - Money Tracker App

Eine moderne, vollständige MERN-Stack-Anwendung zur einfachen Verwaltung persönlicher Finanzen. Mit Mono können Benutzer ihre Einnahmen und Ausgaben verfolgen, detaillierte Statistiken anzeigen und ihre finanzielle Übersicht behalten.

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://mono-app-mern-stack-project.vercel.app)
[![Figma Design](https://img.shields.io/badge/Figma-Design-purple?style=for-the-badge&logo=figma)](https://www.figma.com/file/HCeTzaZ42kt9RnvBhmeS4t/mono---Money-Tracker?node-id=0%3A1&t=MrOxmybCouOlawGS-0)

## 🌟 Features

### 🔐 Authentifizierung
- **Benutzerregistrierung** mit E-Mail-Validierung
- **Sicheres Login-System** mit JWT-Token-Authentifizierung
- **Profilbild-Upload** mit Firebase Storage
- **Session-Management** mit Redux Persist

### 💸 Transaktionsverwaltung
- **Einnahmen & Ausgaben hinzufügen** mit detaillierten Informationen
- **Belege hochladen** für jede Transaktion
- **Transaktionen bearbeiten & löschen**
- **Echtzeit-Übersicht** aller Transaktionen
- **Detailansicht** für einzelne Transaktionen

### 📊 Statistiken & Analytics
- **Flexible Zeiträume**: 7, 14, 30, 90, 180, 365 Tage
- **Interaktive Charts** mit Chart.js
- **Einnahmen vs. Ausgaben Vergleich**
- **Filter-Optionen**: Nach Typ, Betrag, Name, Datum
- **Sortierung**: Aufsteigend/Absteigend

### 🎨 UI/UX Features
- **Dark Mode Support** mit Theme-Toggle
- **Mehrsprachigkeit**: Deutsch, Englisch, Türkisch
- **Responsive Design** für Mobile & Desktop
- **Smooth Animationen** mit Framer Motion
- **Skeleton Loading** für bessere User Experience
- **Toast Notifications** für Feedback
- **Empty States** für leere Daten

### 📱 Progressive Web App (PWA)
- **Offline-Fähigkeit** (coming soon)
- **App-Installation** auf Mobile Devices
- **Push Notifications** (coming soon)

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI Library
- **Redux Toolkit** - State Management mit RTK Query
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Chart.js** - Datenvisualisierung
- **Framer Motion** - Animationen
- **React Intl** - Internationalisierung
- **React Hook Form** - Formular-Validierung
- **React Toastify** - Notifications
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Datenbank
- **Mongoose** - ODM für MongoDB
- **JWT** - Authentifizierung
- **Bcrypt** - Passwort-Hashing
- **Multer** - File Upload
- **Firebase Storage** - Cloud Storage

### Development Tools
- **TypeScript 4.9.5** - Type Safety
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **Git** - Version Control

### Deployment
- **Vercel** - Frontend Hosting
- **MongoDB Atlas** - Cloud Database
- **Firebase** - File Storage

## 🚀 Installation & Setup

### Voraussetzungen
```bash
Node.js >= 18.0.0
npm >= 10.0.0
MongoDB (lokal oder Atlas)
```

### Backend Setup

1. **Repository klonen**
```bash
git clone https://github.com/kemaltt/monoApp-Mern_Stack_Project.git
cd monoApp-Mern_Stack_Project
```

2. **Backend Dependencies installieren**
```bash
cd backend
npm install
```

3. **Environment Variables erstellen**
Erstelle eine `.env` Datei im `backend` Ordner:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret

# Firebase Config
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

4. **Backend starten**
```bash
npm start
# oder für Development mit Nodemon
npm run dev
```

### Frontend Setup

1. **Frontend Dependencies installieren**
```bash
cd frontend
npm install
```

2. **Environment Variables erstellen**
Erstelle eine `.env` Datei im `frontend` Ordner:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:5000
```

3. **Frontend starten**
```bash
npm start
```

Die App läuft jetzt auf `http://localhost:3000`

## 📦 Build für Production

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm start
```

## 🌐 Deployment

### Frontend (Vercel)
1. Push Code zu GitHub
2. Verbinde Repository mit Vercel
3. Setze Environment Variables in Vercel Dashboard
4. Deploy wird automatisch bei jedem Push ausgeführt

### Backend (Render/Railway/Heroku)
1. Push Code zu GitHub
2. Verbinde Repository mit Hosting-Plattform
3. Setze Environment Variables
4. Deploy wird automatisch ausgeführt

## 📱 API Endpoints

### Authentication
```
POST /api/auth/register     - Benutzer registrieren
POST /api/auth/login        - Benutzer anmelden
POST /api/auth/refresh      - Token erneuern
GET  /api/auth/profile      - Profil abrufen
```

### Transactions
```
GET    /api/transactions              - Alle Transaktionen abrufen
GET    /api/transactions/:id          - Einzelne Transaktion abrufen
POST   /api/transactions              - Neue Transaktion erstellen
PUT    /api/transactions/:id          - Transaktion bearbeiten
DELETE /api/transactions/:id          - Transaktion löschen
```

### Users
```
GET  /api/users/profile       - Benutzerprofil abrufen
PUT  /api/users/profile       - Profil aktualisieren
```

## 🎯 Verwendung

1. **Account erstellen**: Registriere dich mit E-Mail und Passwort
2. **Profilbild hochladen**: Optional ein Profilbild hinzufügen
3. **Transaktionen hinzufügen**: Klicke auf das "+" Icon
4. **Einnahmen/Ausgaben wählen**: Toggle zwischen Income/Expense
5. **Details eingeben**: Name, Betrag, Datum, optional Beleg
6. **Statistiken anzeigen**: Wechsel zum Statistics-Tab
7. **Filter verwenden**: Filtere nach Typ, sortiere nach Datum/Betrag/Name
8. **Zeitraum wählen**: 7 Tage, 1 Monat, 3 Monate, etc.
9. **Dark Mode**: Aktiviere im Profil-Bereich
10. **Sprache wechseln**: Wähle zwischen DE/EN/TR

## 🎨 Design System

### Farben
```css
/* Light Mode */
--primary-blue: #2B47FC
--background-green: #00B495
--background-red: #E4797F
--text-primary: #000000
--text-secondary: #666666
--background: #FFFFFF

/* Dark Mode */
--primary-blue-dark: #5B7EFF
--text-primary-dark: #FFFFFF
--text-secondary-dark: #A0A0A0
--background-dark: #1F2937
--card-dark: #374151
```

### Responsive Breakpoints
```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

## 🤝 Contributing

Beiträge sind willkommen! Bitte folge diesen Schritten:

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Roadmap

- [x] Basic CRUD Operations
- [x] Authentication & Authorization
- [x] Dark Mode Support
- [x] Multi-language Support
- [x] Statistics & Charts
- [x] Responsive Design
- [ ] PWA Support (Offline Mode)
- [ ] Push Notifications
- [ ] Export to PDF/Excel
- [ ] Budget Goals & Alerts
- [ ] Recurring Transactions
- [ ] Categories Management
- [ ] Data Backup & Restore

## 🐛 Known Issues

- [ ] Chart wird bei sehr vielen Datenpunkten langsam
- [ ] Image Upload manchmal langsam bei großen Dateien
- [ ] Dark Mode Transition flackert kurz

## 📄 License

Dieses Projekt ist unter der MIT License lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## 👨‍💻 Autor

**Kemal**
- GitHub: [@kemaltt](https://github.com/kemaltt)
- LinkedIn: [Dein LinkedIn](https://linkedin.com/in/dein-profil)

## 🙏 Acknowledgments

- Design inspiriert von modernen Finanz-Apps
- Icons von [React Icons](https://react-icons.github.io/react-icons/)
- Illustrationen von Figma Community
- Hosting von Vercel

---

⭐ Wenn dir dieses Projekt gefällt, gib ihm einen Star auf GitHub!

**[Live Demo](https://mono-app-mern-stack-project.vercel.app)** | **[Figma Design](https://www.figma.com/file/HCeTzaZ42kt9RnvBhmeS4t/mono---Money-Tracker?node-id=0%3A1&t=MrOxmybCouOlawGS-0)**
