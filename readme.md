# Implementing Virtual Hosts in NGINX for Nodejs Based Applications

## Background

We'll use NGINX as a proxy to listen to requests to 2 domains `node-nginx.local` and `server2.node-nginx.local` and redirect them to the appropriate ports where the actual servers are hosted.

We'll also use NGINX to implement `HTTPS` instead of implementing it in the node servers.

## The Servers

Two servers `server.js` and `server2.js` runs on port 3000 and 3001 on the same machine respectively. They are run using the commands:

```bash
node server.js
node server2.js
```

## The Setup

Two vhost `conf` files are created and are enabled in NGINX.

File: `node-nginx-1-443.conf`
```
server {
    listen 443 ssl;

    server_name node-nginx.local;

    ssl_certificate /root/certs/server/server.crt;
    ssl_certificate_key /root/certs/server/server.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    error_log /var/log/nginx/server.error.log;
}
```

File `node-nginx-2-443.conf`
```
server {
    listen 443 ssl;

    server_name server2.node-nginx.local;

    ssl_certificate /root/certs/server/server.crt;
    ssl_certificate_key /root/certs/server/server.key;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    error_log /var/log/nginx/server.error.log;
}
```

For port `80`, we'll use the conf `node-nginx-80.conf` to redirect requests to `https`.

File `node-nginx-80.conf`
```
server {
	listen 80 default_server;
	listen [::]:80 default_server;
	server_name _;
	return 301 https://$host$request_uri;
}
```

To simulate the domains, add the following to your hosts file:

```
192.168.13.1    node-nginx.local
192.168.13.1    server2.node-nginx.local
```

Accessing `https://node-nginx.local` will return: `Hi, I\'m index from server 1!`

Accessing `https://server2.node-nginx.local` will return: `Hi, I\'m server 2 residing in the same server as server 1 :)`
