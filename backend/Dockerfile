# 1. Base image for Java
FROM eclipse-temurin:17-jdk AS builder

# 2. Set the working directory
WORKDIR /app

# 3. Copy build files and source code
COPY . .

# 4. gradlew에 실행 권한 부여
RUN chmod +x gradlew

# 5. Build the application
RUN ./gradlew clean build -x test

# 6. Use a lightweight JRE for the runtime
FROM eclipse-temurin:17-jre

# 7. Set the working directory
WORKDIR /app

# 8. Copy the built JAR from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# 9. Expose the application port
EXPOSE 8080

# 10. Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]