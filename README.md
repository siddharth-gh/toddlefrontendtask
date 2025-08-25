# Course Builder Application

A React.js application that allows users to create and manage online courses by adding modules and resources. This application is built with Vite, React, and CSS.

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm (v9 or newer recommended)

### Installation

1. Clone the repository or download the source code:

```bash
git clone <repository-url>
# or
# download and extract the project
```

2. Navigate to the project directory:

```bash
cd toddle-test-app
```

3. Install the dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

### Linting and Formatting

To check for linting errors:

```bash
npm run lint
```

To automatically fix linting errors (when possible):

```bash
npm run lint:fix
```

To format your code using Prettier:

```bash
npm run format
```

### Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Folder Structure

```
my-react-app/
├── eslint.config.js     # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .prettierignore      # Files to ignore by Prettier
├── .vscode/             # VS Code settings
├── public/              # Public assets
├── src/                 # Source files
│   ├── assets/          # Static assets
│   ├── components/      # React components
│   ├── utils/           # Utilities
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
└── index.html           # HTML template
```

```
src/
  ├── components/
  │   ├── modules/
  │   │   ├── CourseBuilder.jsx     # Main component that orchestrates the application
  │   │   ├── ModuleCard.jsx        # Component for displaying individual modules
  │   │   ├── ItemCard.jsx          # Component for displaying individual and module items (links, files)
  │   │   ├── ModuleModal.jsx       # Modal for creating/editing modules
  │   │   ├── LinkModal.jsx         # Modal for adding links to modules
  │   │   └── UploadModal.jsx       # Modal for uploading files to modules
  │   │   └── Outline.jsx           # Modal for displaying Course outline if more than 1 course
  │   └── ui/
  │       ├── Header.jsx            # Application header with search and dropdown
  │       └── EmptyState.jsx        # Shown when no modules exist
  ├── utils/
  │   ├── boldSearch.jsx            # Utility to bold the matched search query
  │   ├── validURL                  # Utility to validate URL
  ├── assets/
  ├── App.jsx                       # App entry point
  ├── App.css                       # Application styling
  ├── main.jsx
  └── index.css
  ├── ThemeContext.jsx              # Stores global theme state
```

## Application Architecture

### Component Hierarchy

```
App
└── CourseBuilder
    ├── Header
    ├── EmptyState (conditionally rendered)
    ├── ModuleCard (multiple instances)
    │   └── ItemCard (multiple instances)
    ├── ItemCard (multiple instances)
    ├── ModuleModal
    ├── LinkModal
    └── UploadModal
```
