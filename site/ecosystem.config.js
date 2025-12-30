module.exports = {
  apps: [
    {
      name: 'infographic-site',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      interpreter: 'node',
      cwd: 'C:\\Users\\22595\\Desktop\\SERVER\\Infographic\\site',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
