# Step 1: Set up the build environment using Node.js
FROM node:20-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Accept GitHub Action secrets as build args
ARG VITE_APP_REST_API
ARG VITE_APP_RAZOR_PAY_KEY
ARG VITE_APP_FORM_SIG
ARG VITE_DEBUG

# Generate .env dynamically inside the container
RUN echo "VITE_APP_REST_API=$VITE_APP_REST_API" > .env && \
    echo "VITE_APP_RAZOR_PAY_KEY=$VITE_APP_RAZOR_PAY_KEY" >> .env && \
    echo "VITE_APP_FORM_SIG=$VITE_APP_FORM_SIG" >> .env && \
    echo "VITE_DEBUG=$VITE_DEBUG" >> .env

# Step 2: Install dependencies
COPY package.json ./
RUN npm install

# Step 3: Copy the rest of the application files, including the public folder
COPY . .

# Step 4: Build the Vite app
RUN npm run build

# Step 5: Set up the production environment using Nginx
FROM nginx:alpine

# Step 6: Copy the build output and public assets from the build stage to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 7: Expose port 80 for Nginx
EXPOSE 80

# Step 8: Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
