module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3, // Lancer 3 instances en parallèle
      exec_mode: "cluster", // Utiliser le mode cluster pour exécuter plusieurs instances
      error_file: "./logs/err.log", // Écrire les erreurs dans le fichier logs/err.log
      env_production: {
        NODE_ENV: "production",
      },
      max_memory_restart: "200M", // Limiter l'utilisation de mémoire à 200 Mo
    },
  ],
};

//Commande pour lancer avec PM2 : pm2 start ecosystem.config.js --env production