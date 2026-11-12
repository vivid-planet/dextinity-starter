# Docker Compose Deployment

## Deployment

Log in to the server where the Docker containers are running via SSH and run the deploy script from the repository checkout. It pulls the latest changes of the checked-out branch, injects the site configs and rebuilds/restarts the containers. The script can be run from any directory.

```
.docker-compose/deploy.sh
```

## Traefik Dashboard

Traefik dashboard available at http://localhost:8088 (Port forwarding is required).
