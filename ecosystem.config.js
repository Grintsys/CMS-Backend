module.exports = {
  apps : 
  [
    {
      name      : 'inplas-api',
      script    : 'API/index.js',
      env: {
        "PORT": 8091,
        "NODE_ENV": "development"
      },
    },
    {
      name      : "inplas-backend",
      script    : "serve",
      env: {
        "PM2_SERVE_PATH": 'Backend/build',
        "PM2_SERVE_PORT": 3001
      }
    }
  ]
};
