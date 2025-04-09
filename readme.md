# README for Docker-Compose Setup and Kong Installation

## Prerequisites

Ensure you have the following installed:
- Docker: [Install Docker](https://www.docker.com/get-started)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)
- PowerShell (for Windows)

## Project Setup with Docker Compose

### Steps to Run the Project:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dirtylooks1306/esd_G4T1.git

2. **Build and start the containers in the root folder**
    ```bash
    docker compose up --build

    ```
    May need to manually start some containers, as some containers may fail due to the time it takes for kafka to set up

3. **Run kong-setup.ps1 in powershell to set up Kong routes once all containers have started**
    ```bash
    ./kong-setup.ps1

4. **start the frontend**
    ```bash
    cd Frontend/shoplio
    npm run dev
    ```
    Go to localhost:5173