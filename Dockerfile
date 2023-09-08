# Building layer
FROM node:16-alpine as development

RUN addgroup -S bit24group && adduser -S ubuntu -G bit24group
USER ubuntu

# Optional NPM automation (auth) token build argument
# ARG NPM_TOKEN

# Optionally authenticate NPM registry
# RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}

#DYNAMO DB
ENV VD_DYNAMODB_REGION="sa-east-1"
ENV VD_DYNAMODB_ACCESS_KEY="AKIA2ULAP2PR32YB2CJK"
ENV VD_DYNAMODB_SECRET_ACCESS_KEY="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"

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm ci

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:16-alpine as production

RUN addgroup -S bit24group && adduser -S ubuntu -G bit24group
USER ubuntu
# Optional NPM automation (auth) token build argument
# ARG NPM_TOKEN

# Optionally authenticate NPM registry
# RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN npm ci --omit=dev

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]