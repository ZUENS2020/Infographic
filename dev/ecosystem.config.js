module.exports = {
  apps: [
    {
      name: 'infographic-dev',
      script: 'node_modules/vite/bin/vite.js',
      args: '--host',
      interpreter: 'node',
      cwd: 'C:\\Users\\22595\\Desktop\\SERVER\\Infographic\\dev',
      instances: 1,
      autorestart: false,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development'
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
