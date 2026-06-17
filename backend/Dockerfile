# ===== Etapa 1: compilar el .jar con Maven =====
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cachear dependencias primero (solo se re-descargan si cambia el pom.xml)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Compilar el proyecto
COPY src ./src
RUN mvn -B clean package -DskipTests

# ===== Etapa 2: imagen final liviana (solo Java para ejecutar) =====
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
