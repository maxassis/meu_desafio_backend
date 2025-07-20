# ---- Base ----
# Using a slim image and installing curl for healthchecks
FROM node:20-slim AS base
WORKDIR /usr/src/app
RUN apt-get update -qq &&     apt-get install -y -qq --no-install-recommends openssl curl wget

# ---- Builder ----
# This stage installs all dependencies, generates the prisma client, and builds the app.
FROM base AS builder
WORKDIR /usr/src/app

# Install all dependencies, including dev dependencies needed for the build
COPY package.json package-lock.json* ./
RUN npm ci

# Copy Prisma schema and generate the client
COPY --chown=node:node prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the source code
COPY --chown=node:node . .

# Build the application
RUN npm run build

# Remove development dependencies to lighten the node_modules folder
RUN npm prune --production

# ---- Production ----
# This is the final, small, and secure image.
FROM base AS production
WORKDIR /usr/src/app

# Create a non-root user and switch to it
USER node

# Copy only the necessary production artifacts from the builder stage
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma/

# Expose the application port
EXPOSE 3000

# Healthcheck to ensure the application is responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Command to run the application directly with node

CMD [ "node", "dist/main" ]