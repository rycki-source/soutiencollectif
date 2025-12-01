# BUILD DE PRODUCTION - SOUTIEN COLLECTIF

Date: 30/11/2025 13:56:45,22
Version: 1.0.0

## DEPLOIEMENT

1. Configurez les variables dans backend/.env.production
2. Installez PostgreSQL sur votre serveur
3. Installez PM2: npm install -g pm2
4. Demarrez: pm2 start ecosystem.config.js --env production

## SERVEUR WEB (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/build/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
    }
}

server {
    listen 80;
    server_name admin.your-domain.com;

    location / {
        root /path/to/build/admin;
        try_files $uri $uri/ /index.html;
    }
}
```

URLs de production:
- Site: https://your-domain.com
- Admin: https://admin.your-domain.com
- API: https://your-domain.com/api
