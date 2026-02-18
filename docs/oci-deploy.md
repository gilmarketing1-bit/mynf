# Deploy Oracle Cloud Free Tier (OCI)

## 1. Recursos OCI (Always Free)
- 1 VM Ubuntu 22.04 (ARM ou AMD)
- 1 VCN + subnet pública
- Security List liberando portas 22, 80 e 443
- 1 Volume adicional opcional para dados persistentes

## 2. Preparação da VM
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
sudo apt install -y docker-compose-plugin
```

## 3. Deploy da aplicação
```bash
git clone <seu-repo>
cd mynf/infra
cp ../.env.example ../.env
# editar .env com segredos reais

docker compose --env-file ../.env up -d --build
```

## 4. Reverse proxy e domínio
- Nginx no serviço `nginx` recebe HTTP na porta 80.
- Para HTTPS, adicionar Certbot no host e montar certificados no container Nginx.

## 5. Operação inicial
```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

## 6. Backup (mínimo)
- Postgres dump diário via cron no host.
- Snapshot semanal do volume (quando possível).
