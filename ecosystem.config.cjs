module.exports = {
  apps: [
    {
      name: "pkmovie-app",
      script: "pnpm",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
