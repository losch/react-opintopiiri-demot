# Kojelauta - Kuvitteellinen hälytysruutu

![Screenshot](./screenshot.png?raw=true)

# Arkkitehtuuri

![Screenshot](./arkkitehtuuri.png?raw=true)

# Kääntäminen ja ajaminen

1. `./mvnw package`
2. `java -jar bundle/target/bundle-0.0.1-SNAPSHOT.jar`

# Kehitysympäristö

Terminaalissa #1 (backend käyntiin)

```
cd backend
./mvnw spring-boot:run -Dskip.tests
```

Terminaalissa #2 (frontend käyntiin)

```
cd frontend
yarn
yarn start
```

Selaimeen auki http://localhost:3000
