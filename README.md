# Customize Mendix Pluggable Widgets (PWB Monorepo)

This repository is structured as an **npm Monorepo Workspace** for developing, managing, and building multiple custom Mendix Pluggable Widgets. Using a unified monorepo architecture, developers can install, lint, test, build, and deploy all widgets simultaneously or individually from the root folder.

---

## 📁 Repository Structure (โครงสร้างของ Repository)

The workspace is organized with a shared dependency model and isolated widget directories managed via npm workspaces:

```bash
Customize-mendix-widget-pwb-antigravity/
├── package.json                 # Root monorepo configuration, shared scripts & workspaces
├── package-lock.json            # Unified dependency lockfile for the entire project
├── scripts/
│   └── rename_mpk.js            # Automated post-release versioning, renaming & deployment script
├── pwbDatePicker/               # Widget 1: Premium Date and Range Picker (with BE/AD and Time Picker)
│   ├── package.json             # Widget dependency settings & build scripts
│   ├── tsconfig.json            # TypeScript configuration
│   ├── src/                     # React & TSX sources (Components, styling, XML schema)
│   │   ├── PwbDatePicker.xml    # Widget Properties definition for Mendix Studio Pro
│   │   ├── PwbDatePicker.tsx    # Mendix wrapper runtime entrypoint
│   │   ├── components/          # Inner React core logic components
│   │   └── ui/                  # Styling files (Premium CSS design system)
│   └── dist/                    # Compiled and bundled production packages (.mpk)
└── pwbComboBox/                 # Widget 2: Premium Customizable Combobox Select Input
    ├── package.json
    ├── src/
    └── dist/
```

---

## 🚀 Build & Release Automation (ระบบอัตโนมัติในการ Build)

When you execute a production build using `release` commands, the project triggers a specialized script (`scripts/rename_mpk.js`) that automates the deployment cycle:

1. **Syntax Linting**: Runs Prettier and ESLint to format and inspect all code files.
2. **Standard MPK Creation**: Compiles the source files into a standard `.mpk` package inside `/dist/`.
3. **Timestamp Versioning**: Generates a versioned and timestamped package (e.g. `pwb.PwbDatePicker_1.0.5_20260529_101213.mpk`).
4. **Target Mendix App Sweeping**:
   - Locates the Mendix app directory specified in the config (`config.projectPath`).
   - Automatically **deletes older versioned files** for the same widget in the Mendix `widgets/` folder.
   - *This prevents "Duplicate Widget ID" compile errors and keeps Mendix Studio Pro neat.*
5. **Instant Deploy**: Copies the fresh timestamped `.mpk` directly into the Mendix app's `widgets/` directory for immediate use.

---

## 💻 Convenience Commands (คู่มือคำสั่งใช้งาน)

You can run commands from the **Root Workspace Folder** (recommended) or navigate into **specific widget folders**.

### 1. Root Level Commands (เรียกใช้งานจาก Folder หลัก)

These commands utilize npm workspaces to orchestrate scripts across the monorepo:

#### Installation & Setup
- **Install all dependencies**:
  ```bash
  npm run install:all
  ```
  *Installs node modules for the root workspace and all widgets in one step.*

#### Linting & Formatting
- **Check code styles for all widgets**:
  ```bash
  npm run lint:all
  ```
- **Fix code styles automatically for all widgets**:
  ```bash
  npm run lint:fix:all
  ```

#### Multi-Widget Compilations
- **Build all widgets (Development mode)**:
  ```bash
  npm run build:all
  ```
- **Release and Deploy all widgets (Production mode with Mendix auto-copy)**:
  ```bash
  npm run release:all
  ```

#### Single Widget Quick Commands
- **Build / Release `pwbDatePicker`**:
  ```bash
  npm run build:pwbDatePicker
  npm run release:pwbDatePicker
  ```
- **Build / Release `pwbComboBox`**:
  ```bash
  npm run build:pwbComboBox
  npm run release:pwbComboBox
  ```

#### Automatic Version Bumping & Releasing
- **Bump PATCH version (e.g. 1.0.5 -> 1.0.6) & Release**:
  ```bash
  npm run bump:patch:pwbDatePicker
  npm run bump:patch:pwbComboBox
  ```
- **Bump MINOR version (e.g. 1.0.5 -> 1.1.0) & Release**:
  ```bash
  npm run bump:minor:pwbDatePicker
  npm run bump:minor:pwbComboBox
  ```

---

### 2. Widget Level Commands (เรียกใช้งานในโฟลเดอร์ของ Widget)

If you are developing a specific widget, you can `cd` into its directory to run dedicated watchers:

```bash
cd pwbDatePicker
# OR
cd pwbComboBox
```

- **Run Dev Watcher**:
  ```bash
  npm run dev
  ```
  *Compiles the code and watches for live changes. Excellent for real-time Mendix testing.*
- **Build (Fast Check)**:
  ```bash
  npm run build
  ```
- **Build Production & Auto-deploy to Mendix**:
  ```bash
  npm run release
  ```

---

## 💻 Mendix Version Compatibility (การรองรับเวอร์ชัน Mendix Studio Pro)

เพื่อช่วยให้นักพัฒนาและผู้ใช้ออกแบบสามารถนำชุด Widget ไปประยุกต์ใช้งานได้อย่างราบรื่น ตารางด้านล่างนี้ระบุการรองรับของเวอร์ชัน Mendix Studio Pro สำหรับชุดโมดูลทั้งหมดใน Monorepo:

| Mendix Studio Pro Version | Compatibility Status | Notes |
| :--- | :---: | :--- |
| **Mendix 10.12+ (LTS) & 10.20+ (Latest)** | ✅ **Fully Supported** | รองรับการทำงานได้สมบูรณ์แบบ 100% ทั้งฝั่ง Client module (V8 Engine) และ React 18+ runtime |
| **Mendix 10.0.0 – 10.11.0** | ✅ **Fully Supported** | รองรับอย่างเต็มรูปแบบด้วยสถาปัตยกรรม React และ Web API ยุคใหม่ |
| **Mendix 9.18.0 – 9.24.x (LTS)** | ✅ **Supported** | รองรับเป็นเวอร์ชันขั้นต่ำที่สุดแนะนำสำหรับการเริ่มใช้งาน (เนื่องจากใช้ React 18 hooks) |
| **Mendix 9.0.5 – 9.17.x** | ⚠️ **Conditional** | สามารถใช้งานได้ แต่อาจต้องตรวจสอบการทำงานของ React hooks และ Datasource props บางประการ |
| **Mendix 8.x และต่ำกว่า** | ❌ **Not Supported** | ไม่รองรับเนื่องจากโมเดล Client Widget ในเวอร์ชันนี้ใช้ Dojo framework เป็นหลัก ไม่ใช่ React Pluggable |

> [!TIP]
> **คำแนะนำสำหรับการใช้งานจริง:**
> แนะนำเป็นอย่างยิ่งให้ใช้ Mendix Studio Pro เวอร์ชัน **9.18.0 LTS เป็นอย่างน้อย** และเพื่อประสิทธิภาพและความสมบูรณ์แบบสูงสุด แนะนำให้เลือกใช้เวอร์ชัน **10.12.0 LTS หรือ 10.20+ (เวอร์ชันล่าสุดในตลาดปัจจุบัน)** ซึ่งตัวเก็บข้อมูล Nanoflow, Client V8 engine และ React runtime ได้รับการปรับแต่งมาให้ทำงานร่วมกับ Pointer Events และ Mobile touch physics ได้ลื่นไหลที่สุด

---

## 📝 Key Developer Guidelines (แนวทางปฏิบัติสำหรับผู้พัฒนา)

> [!NOTE]
> Always run `npm run lint:fix:all` before pushing code or releasing packages. Mendix prerelease checks will reject any build containing Prettier format warnings.

> [!IMPORTANT]
> To link the monorepo to a different Mendix app project, open `pwbDatePicker/package.json` (or `pwbComboBox/package.json`) and update the `"config.projectPath"` value to point relatively or absolutely to your target Mendix project folder.
