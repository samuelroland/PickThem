FROM node:20-slim as build

# Preparations
RUN apt update
RUN apt install git -y

# Clone repository
WORKDIR /build
RUN git clone https://github.com/samuelroland/PickThem.git

# Install deps and build
WORKDIR /build/PickThem
RUN npm install
RUN npm run build

# Take /build/PickThem/dist as the final useful folder for the web interface
FROM caddy:2.8-alpine
# Copy static files to default location of Caddy (/usr/share/caddy/) so we don't need any configuration
COPY --from=build /build/PickThem/dist /usr/share/caddy/
WORKDIR /usr/share/caddy/
EXPOSE 80
EXPOSE 443
