# Use Debian Slim for better compatibility with Prisma/OpenSSL
FROM node:20-slim

# Install OpenSSL (required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy the prisma folder BEFORE npm install
COPY prisma ./prisma/

# Install dependencies (this triggers prisma generate)
RUN npm install

# Copy the rest of your code
COPY . .

# Build the Next.js app
RUN npm run build

# Start the app
# We use a shell command to run migrations before starting the app
CMD npx prisma db push && npm start