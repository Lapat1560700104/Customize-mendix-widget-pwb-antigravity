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

## 📝 Key Developer Guidelines (แนวทางปฏิบัติสำหรับผู้พัฒนา)

> [!NOTE]
> Always run `npm run lint:fix:all` before pushing code or releasing packages. Mendix prerelease checks will reject any build containing Prettier format warnings.

> [!IMPORTANT]
> To link the monorepo to a different Mendix app project, open `pwbDatePicker/package.json` (or `pwbComboBox/package.json`) and update the `"config.projectPath"` value to point relatively or absolutely to your target Mendix project folder.
