# Pont Network Backend

This repository contains the backend service for the Pont Network, built with [NestJS](https://nestjs.com/). It is designed to provide a robust and scalable API service for interacting with the Pont Network ecosystem. The software runs on ships and represents the Data Acquisition Unit (DAU), which reads data from ship sensors and broadcasts it to the Solana blockchain.

## Table of Contents

- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/Ceres-Blockchain-Solutions/pont-network-backend.git
cd pont-network-backend
npm install
```

## Environment Configuration
## Usage
Run the development server:
```
npm run start:dev
```
This will start the NestJS application on the port defined in your .env file (default is 3000).

## Available Scripts
The backend will be available at http://localhost:3000.
- ```npm run start```: Starts the application in production mode.
- ```npm run start:dev```: Starts the application in development mode (with hot-reload).
- ```npm run start:debug```: Starts the application in debug mode.
- ```npm run lint```: Runs the linter to check for code quality issues.
- ```npm run format```: Formats the codebase using Prettier.


## API Documentation
The API documentation is available through Swagger. Once the application is running, navigate to:

```
http://localhost:3000/api
```
This provides a complete overview of the available endpoints and their expected input/output.

## Contributing
We welcome contributions to this project! If you have any improvements or bug fixes, please fork the repository and create a pull request.

Fork the repository.
1. Create a new branch (```git checkout -b feature/my-feature```).
2. Commit your changes (```git commit -m 'Add some feature'```).
3. Push to the branch (```git push origin feature/my-feature```).
4. Open a pull request.

## Licence
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
