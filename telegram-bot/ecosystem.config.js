// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'telegram-bot',
      script: './dist/index.js',
      watch: ['./dist'],
      ignore_watch: ['node_modules', 'logs', 'logs/*', 'logs/**/*'],
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
    },
  ],
}
