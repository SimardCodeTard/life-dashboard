# Life Dashboard
A multi-function app that I use as a dashboard to organize my life ! Built with NextJS
## Setup
Create a .env or .local.env file and define the following environment variables:
- NEXT_PUBLIC_API_URL: The URl to your api ([host]/api/v1)
- NEXT_PULIC_LOGGING_LEVEL: The logging level to use (0:DEBUG / 1:DEBUG / 2:WARN / 3: ERROR)
- APP_PASSWORD: Password to access the application
- JWT_SECRETY: Secret used when generating access tokens
- MONGO_DB_URL_LOCAL of in local OR MONGO_DB_URI if deployed: URI to your mongoDB instance
- DB_NAME: Name of the mongoDB Database to use for persistence
- BLOCK_OPEN_AI_API_CALLS: True if the calls to OpenAI's API should be blocked, should be true when testing
- OPEN_AI_API_KEY: API key to OpenAI
- OPEN_WEATHER_API_KEY: API key to OpenWeather