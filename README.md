# Study Buddy KKW

> One hub for every note, PYQ, and resource K.K. Wagh students actually need.

Study Buddy KKW is a modern, open-source educational resource portal designed specifically for engineering students of the **K. K. Wagh Institute of Engineering Education & Research (KKWIEER)**. Used by 400+ students per year, this platform is built to make it easy for anyone to find unit-wise study materials, handwritten notes, and past year question papers (PYQs) in under 30 seconds.

---

## 🚀 Key Features & Capabilities

### ⚡ Navigation & User Interface
- **Webflow-Style Vertical Sidebar**: Clean, collapsible left navigation sidebar (`components/Sidebar.tsx`) with categorized links (Academic Courses, Student Utilities, Support) and active route highlighting.
- **Glassmorphic Floating Header**: Sticky top header (`components/Navbar.tsx`) with backdrop-blur styling, upgraded brand mark gradient, and an interactive **"Academic Years ▾"** dropdown menu.
- **Interactive Quick-Access Feature Grid**: Home page 4-card utility launcher featuring background tints, hover arrow animations, and quick access to major student tools.
- **Dynamic Year Cards**: Accent top borders (1st Year Blue, 2nd Year Emerald, 3rd Year Amber, 4th Year Indigo), micro-interaction hover elevation, and high-contrast WCAG AA compliant subject tag pills.

### 🔍 Command-Palette Search (`Ctrl + K`)
- **Web Worker Off-Main-Thread Search Index**: Background worker thread (`public/workers/search.worker.js`) executing search queries and index compilation to ensure zero input lag on mobile devices.
- **Command-Palette Search Bar**: Pressing `Ctrl + K` or `Cmd + K` anywhere on the site focuses the search bar to search subjects, unit topics, notes, and reference links.

### 📝 Interactive Practice Quiz Engine
- **Unit-Wise Self-Assessment MCQs**: Custom practice quiz engine (`app/[year]/[subject]/quiz`) displaying progress bar, timer, score dashboard, and unit filters.
- **Instant Visual Feedback**: Option buttons with color-coded correct/incorrect state feedback, detailed explanations, and high-score persistence in `localStorage`.

### 🧮 SPPU SGPA & CGPA Transcript Calculator
- **Official SPPU Credit Weightage**: Interactive GPA calculator (`app/calculator`) supporting semester-wise SGPA and cumulative CGPA calculation based on KKWIEER syllabus credit structure.

### 📊 Study Time Tracker & Syllabus Analytics
- **Privacy-Respecting Analytics**: Subject viewing duration tracking (`app/analytics`) with visual progress rings, study patterns breakdown, and local storage retention.

### 📶 Service Worker Offline Caching
- **Offline Capabilities**: Stale-while-revalidate service worker (`public/sw.js`) caching static pages, subject notes JSON configurations, and local PDF files for low-network environments inside college labs and deep classrooms.
- **Offline Indicator Badge**: Navbar badge displaying live network connection state (`Offline Mode`).

### ♿ Accessibility & High Contrast Themes (`Alt+Shift+H`)
- **End-to-End High Contrast Theme**: Accessibility-compliant high-contrast theme (AA/AAA WCAG standard compliant) togglable via theme selector or `Alt+Shift+H` keyboard shortcut.

### 🏆 Contributor Leaderboard & Note Uploader
- **Gamified Student Contributions**: Interactive note submission portal (`app/contribute`) featuring community points leaderboard and contributor rankings.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, SSG & Dynamic Routing)
- **Styling**: Tailwind CSS & Vanilla CSS Design System (Strict Blue/Emerald/Amber/Slate palette — Zero purple/violet hues)
- **Language**: TypeScript (Strict typing & AJV JSON Schema Validation)
- **State/Themes**: `next-themes` (Light, Dark, High Contrast) & Lucide React Icons
- **Performance**: Web Workers (`search.worker.js`) & Service Worker (`sw.js`) PWA
- **Deployment**: Vercel (Automated CI/CD from GitHub)

---

## 💻 Getting Started

### Prerequisites

Ensure you have **Node.js 18.0.0+** installed on your system.

### Installation

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/Sanket-103-pvt/StudyBuddy-KKW.git
   cd study-buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. Validate JSON content files:
   ```bash
   npm run validate
   ```

6. Run test suite:
   ```bash
   npm test
   ```

---

## 🤝 Contributing

We welcome all contributions! To add notes, update syllabus, or fix links, you do **not** need to touch any Next.js code. The resource content is stored as simple JSON files inside the `content/` directory.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for step-by-step instructions on how to add/update resources and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
