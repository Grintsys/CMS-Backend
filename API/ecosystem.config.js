module.exports = {
  apps : 
  [
    {
      name      : 'inplas-api',
      script    : './index.js',
      watch     : true,
      env: {
        "PORT": 8090,
        "NODE_ENV": "development"
      },
    }
  ]
};
