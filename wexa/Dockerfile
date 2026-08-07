# Stage 1: Build using official Maven image with Java 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /workspace/app

# Copy pom.xml and source code
COPY pom.xml .
COPY src src

# Build the application using standard maven
RUN mvn clean package -DskipTests

# Stage 2: Run the application using lightweight Java 21 JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /workspace/app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]