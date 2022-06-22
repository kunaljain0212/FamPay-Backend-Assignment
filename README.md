# FamPay Backend Assignment

Backend for an app to demonstrate the usage of YouTube API

# Features

- Polls the Youtube API every 30 seconds to fetch latest videos based on a search query and saves them into a MongoDB database.
- API to fetch paginated videos sorted in descending order of published datetime.
- Partial Search API to filter through the list of videos.
- Multiple API key support - Automatically uses a different API key when one's quota is exhausted.

# Pre-Requisites

- Google API key. Create a `.env` file in the root folder following the template given in `.env.example` and add the API key(s) to the file.
- Docker and docker-compose.
- If not using docker, the app needs Node.js, NPM and MongoDB.

# Instructions to Execute

- `docker-compose up` if using docker.
If not using docker :
- `sudo systemctl start mongodb` to start MongoDB globally.
- `npm run dev` to start the server in development mode.

Make sure you have the packages installed using `npm install`.

# Trying it out

- Open `localhost:3000` to find the Interactive API Explorer. 
- Click on the `Videos` GET API -> Try it out -> Execute.
- Play around with the page and searchText parameters.

# Code Navigation

- The entry point to the server rests in `server/index.js`.
- Available API routes can be found in `server/routes.js`.
- `server/routes.js` is the first file an API request reaches, where it is redirected to the specific router, for example, `server/api/controllers/videos/router.js`.
- The router then routes the request to the appropriate controller.
- The control checks the inputs and delegates the task to a service, found in the `server/services` directory.
- The service acts on the data, interacts with the database and returns the result to the controller, which in turn returns the response to the user.
- Youtube API integration can be found in `server/api/services/youtube.services.js`.