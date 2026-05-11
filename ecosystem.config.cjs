module.exports = {
  apps: [
    {
      name: "pkmovie-app",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
