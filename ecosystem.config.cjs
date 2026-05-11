module.exports = {
  apps: [
    {
      name: "pkmovie",
      script: "./node_modules/next/dist/bin/next",
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
