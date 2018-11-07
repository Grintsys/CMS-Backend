module.exports = {
  apps : [{
    "name"      : 'inplas-backend',
    "script"    : 'serve',
    "args"      : ["-s"],
    "watch": true,
    "env": {
      "PM2_SERVE_PATH": './build',
      "PM2_SERVE_PORT": 8080
    }
  }],
};
