<Docker Compose로 실행하는 경우>
1. /backend/src/main/resources/application.properties의 spring.datasource.url 부분의 domain name을 database service의 이름인 mysql로 수정 (jdbc:mysql://mysql:3306)

2. Docker Compose 실행
    - Root Directory에서 docker-compose up 명령어를 실행.

3. Backend container가 build 되지 않을 경우, database container가 완전히 설정되지 않아서 그렇기 때문에 완전히 설정될 때까지 잠시 대기헀다가 docker-compose up 명령어를 한번 더 실행.

4. Web browser에서 localhost:3000으로 접속하여 App 실행을 확인.

<Kubernetes로 실행하는 경우>
1. /backend/src/main/resources/application.properties의 spring.datasource.url 부분의 domain name을 database service의 이름인 mysql-service로 수정 (jdbc:mysql://mysql-service:3306)

2. Docker Hub에서 frontend/backend repository 생성.

3. frontend/backend image를 build.
    - Root directory에서 docker build -t [본인의 Docker Hub Username]/frontend:latest ./frontend 명령어를 실행하여 backend image를 build.
    - Root directory에서 docker build -t [본인의 Docker Hub Username]/backend:latest ./backend 명령어를 실행하여 backend image를 build.

4. frontend/backend image를 Docker Hub에 Upload.
    - Root directory에서 docker push [본인의 Docker Hub Username]/frontend:latest 명령어를 실행하여 image를 Upload.
    - Root directory에서 docker push [본인의 Docker Hub Username]/backend:latest 명령어를 실행하여 image를 Upload.

5. test.yaml(Kubernetes 선언적 배포 file)에서 container의 image를 지정하는 부분을 본인의 Docker Hub의 것으로 수정.

6. minikube 실행.
    - minikube start 명령어 실행.

7. 선언적 배포 파일 적용.
    - Root directory에서 kubectl apply -f test.yaml 명령어 실행.

8. 생성된 pod 이름 확인.
    - kubectl get pods 명령어 실행하여 생성된 pod 목록의 이름 확인.

9. Port-forwarding.
    - kubectl port-forward pod/[frontend pod 이름] 3000:3000 명령어 실행.
    - kubectl port-forward pod/[backend pod 이름] 8080:8080 명령어 실행.

10. Web Browser에서 localhost:3000으로 접속하여 App 실행 확인.