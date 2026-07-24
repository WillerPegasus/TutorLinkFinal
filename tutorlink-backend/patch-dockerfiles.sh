#!/bin/bash
# À exécuter depuis le dossier tutorlink-backend/ (celui qui contient
# api-gateway/, auth-service/, etc.)
set -e

SERVICES="api-gateway auth-service user-service tutor-service booking-service notification-service message-service"

for svc in $SERVICES; do
  if [ ! -f "$svc/Dockerfile" ]; then
    echo "⚠️  $svc/Dockerfile introuvable, ignoré."
    continue
  fi

  # Récupère le port EXPOSE existant pour ne rien casser
  PORT=$(grep -oP '(?<=EXPOSE )\d+' "$svc/Dockerfile" | head -1)

  cat > "$svc/Dockerfile" <<EOF
# syntax=docker/dockerfile:1.4
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Cache Maven partagé entre TOUS les services + retries automatiques
# en cas de coupure réseau (au lieu d'échouer après 49 minutes)
RUN --mount=type=cache,target=/root/.m2 \\
    mvn clean package -DskipTests \\
    -Dmaven.wagon.http.retryHandler.count=5 \\
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=120

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE ${PORT}
ENTRYPOINT ["java", "-Xmx256m", "-XX:+UseSerialGC", "-jar", "app.jar"]
EOF

  echo "✅ $svc/Dockerfile patché (port $PORT)"
done

echo ""
echo "Terminé. Prochaine étape : vérifie que buildx est installé avec"
echo "  docker buildx version"
echo "puis relance :"
echo "  DOCKER_BUILDKIT=1 docker compose build"
