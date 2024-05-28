# Reddit Clone

## Project Overview

This project is a Reddit clone built using a modern web stack. It features a robust backend with Node.js, PostgreSQL, and Redis, and a dynamic frontend with React and TypeScript. The application leverages GraphQL and Apollo for data fetching and state management, with TypeORM for database interactions. 

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [Next.js](https://nextjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [shadcn/ui](https://ui.shadcn.dev/)

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [GraphQL](https://graphql.org/)
  - [TypeGraphQL](https://typegraphql.com/)
  - [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [TypeORM](https://typeorm.io/)
  - [Redis](https://redis.io/)

- **Package Manager:**
  - [pnpm](https://pnpm.io/)

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- pnpm
- PostgreSQL
- Redis

### Clone the Repository

```bash
git clone https://github.com/yourusername/reddit-clone.git
cd reddit-clone
```

### Backend Setup
1. Navigate to the server directory
   ```bash
   cd /server
   ```
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Create an `.env` file inside `server` directory and add your database credentials and Redis connection details.
   ```bash
    # DB 
    DB_TYPE=""
    DB_HOST=""
    DB_PORT=""
    DB_USERNAME=""
    DB_PASSWORD=""
    DB_NAME=""
    DB_SYNCHRONIZE=true #turn on or off database synchronization
    DB_LOGGING=true #turn on or off database logging

    # Server
    NODE_ENV=development
    SERVER_PORT=4000

    # Redis session secret
    REDIS_CLIENT_SECRET="secrent" #change this to a random string

    #nodemailer 
    MAIL_USER_EMAIL=""
    MAIL_USER_PASSWORD=""
   ```
4. Start the development server
   ```bash
   pnpm dev
   ```
5. For live reloading during development, open a new terminal and run:
   ```bash
   pnpm watch
   ```
### Frontend Setup
1. Navigate to the web directory
   ```bash
   cd /web
   ```
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Start the development server
   ```bash
   pnpm dev
   ```

#### Contributing
If you wish to contribute to this project, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

#### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

#### Acknowledgments
This project uses several open-source libraries and tools. We appreciate the contributions of the open-source community that made this project possible.