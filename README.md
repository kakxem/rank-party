# Rank Party

Rank Party is a collaborative game where players rank items in a list with their friends. Each player votes on each item, scoring them from 0 to 10. At the end of the game, a table displays each item's score and its position in the list.

## Features

- **Real-time Collaboration**: Play with friends and rank items together.
- **Flexible Scoring**: Score each item from 0 to 10.
- **Dynamic Results**: View a table of results showing each item's score and rank.
- **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) as the package manager.
- [npm](https://www.npmjs.com/) for running specific scripts (only for the PartyKit development server).
- [Vite](https://vitejs.dev/) for development and build processes.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kakxem/rank-party.git
   cd rank-party
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

### Running the App

To start the development server, run:

```bash
bun run dev
```

### Running PartyKit Development Server

To start the PartyKit development server, which requires npm (not Bun), run:

```bash
npm run dev:party
```

### Building the App

To build the app for production, run:

```bash
bun run build
```

### Linting

To lint the codebase, run:

```bash
bun run lint
```

## Project Structure

- **src/**: Contains the main source code for the application.
  - **components/**: Reusable UI components.
  - **hooks/**: Custom React hooks.
  - **lib/**: Utility functions and libraries.
  - **modules/**: Feature-specific modules, such as game, lobby, and result.
  - **types.ts**: TypeScript type definitions.
  - **App.tsx**: The main application component.
  - **main.tsx**: Entry point for the React application.

- **party/**: Contains server-side logic for PartyKit.
  - **index.ts**: Main server implementation.
  - **actions.ts**: Helper functions for server actions.

- **public/**: Static assets like images and icons.

- **package.json**: Project metadata and dependencies.

- **tsconfig.app.json** and **tsconfig.node.json**: TypeScript configuration files for the app and node environments.

- **README.md**: Project documentation.

## Usage

1. **Create or Join a Room**: Start by creating a new room or joining an existing one with a room code.
2. **Vote on Items**: Each player scores items from 0 to 10.
3. **View Results**: Once all items are scored, view the results table showing scores and rankings.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with React, TypeScript, and Vite.
- Special thanks to [oyoke23](https://github.com/oyoke23) for helping me with the project.
