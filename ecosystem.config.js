module.exports = {
  apps: [
    {
      name: 'vasundhara-academy',
      script: 'npm',
      args: 'start',
      instances: 'max', // Or a specific number like 1, 2 depending on your EC2 instance size
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
