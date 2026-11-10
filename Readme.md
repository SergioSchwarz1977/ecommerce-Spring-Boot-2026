# Tienda Ecommerce

Aplicación web sencilla para administrar el catálogo de una tienda de tecnología. Está desarrollada con Spring Boot: sirve un frontend estático en HTML, CSS y JavaScript, expone una API REST y persiste los productos en MySQL.

## Tecnologías

- Java 25 (LTS)
- Spring Boot 4.1.2
- Docker
- Spring Web MVC y Spring Data JPA
- MySQL
- HTML, CSS, JavaScript y Bootstrap 5
- Maven Wrapper

## Requisitos

- JDK 25
- Docker
- MySQL en ejecución

La aplicación se ejecutará en un contenedor Docker.

## Configuración de MySQL

La aplicación usa por defecto la URL `jdbc:mysql://localhost:3306/ecommerce` y el usuario `root`, según `src/main/resources/application.properties`.

1. Crea la base de datos:

   ```sql
   CREATE DATABASE ecommerce;
   ```

2. Configura la contraseña de MySQL. Puedes definirla como variable de entorno antes de iniciar la aplicación para no guardarla en el repositorio:

   **PowerShell**

   ```powershell
   $env:SPRING_DATASOURCE_PASSWORD = "tu_clave"
   ```

   O configura `spring.datasource.password` en `src/main/resources/application.properties`.

Hibernate está configurado con `spring.jpa.hibernate.ddl-auto=update`; al iniciar, crea o actualiza la tabla `producto` a partir de la entidad `Producto`. Para producción, revisa esta estrategia y utiliza una gestión explícita de migraciones.

## Ejecutar

Desde la raíz del proyecto:

```powershell
.\mvnw.cmd spring-boot:run
```

La aplicación se inicia en `http://localhost:8080`. El frontend se sirve desde Spring Boot; no hace falta levantar un servidor web separado. La portada está en `http://localhost:8080/`.

Para compilar y ejecutar las pruebas:

```powershell
.\mvnw.cmd test
```

## Frontend

- `http://localhost:8080/` — portada (`index.html`)
- `http://localhost:8080/ofertas.html` — listado, búsqueda y acciones sobre productos
- `http://localhost:8080/formAlta.html` — formulario para crear productos
- `http://localhost:8080/nosotros.html` — página informativa
- `http://localhost:8080/formLogin.html` — página de acceso de administrador

La página de ofertas obtiene los datos desde la API y permite buscar por ID, agregar, editar y eliminar productos. El formulario de alta envía los datos como JSON.

## API REST

URL base: `http://localhost:8080/productos`

| Método | Endpoint | Descripción | Respuesta habitual |
|---|---|---|---|
| `GET` | `/productos/listar` | Lista todos los productos. | `200 OK` |
| `GET` | `/productos/{id}` | Obtiene un producto por ID. | `200 OK`; `404 Not Found` si no existe |
| `POST` | `/productos/crear` | Crea un producto. | `201 Created` |
| `PUT` | `/productos/actualizar/{id}` | Actualiza los campos de un producto existente. | `200 OK`; `404 Not Found` si no existe |
| `DELETE` | `/productos/eliminar/{id}` | Elimina un producto por ID. | `204 No Content` |

El modelo `Producto` contiene estos campos:

| Campo | Tipo JSON | Descripción |
|---|---|---|
| `id` | número | Identificador generado por la base de datos. |
| `nombre` | texto | Nombre del producto. |
| `descripcion` | texto | Descripción. |
| `categoria` | texto | Categoría. |
| `precio` | número | Precio. |
| `stock` | número entero | Unidades disponibles. |

### Ejemplos

Listar productos:

```bash
curl http://localhost:8080/productos/listar
```

Consultar el producto con ID `1`:

```bash
curl http://localhost:8080/productos/1
```

Crear un producto:

```bash
curl -X POST http://localhost:8080/productos/crear \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Notebook",
    "descripcion": "Notebook de 15 pulgadas",
    "categoria": "Computación",
    "precio": 850000,
    "stock": 10
  }'
```

Actualizar un producto:

```bash
curl -X PUT http://localhost:8080/productos/actualizar/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Notebook",
    "descripcion": "Notebook de 15 pulgadas",
    "categoria": "Computación",
    "precio": 875000,
    "stock": 8
  }'
```

Eliminar un producto:

```bash
curl -X DELETE http://localhost:8080/productos/eliminar/1
```

## Estructura principal

```text
src/main/java/com/ecommerce/tienda/
├── controllers/  # Endpoints REST de productos
├── entity/       # Entidad JPA Producto
├── exception/    # Excepciones y manejador global
├── repository/   # Acceso a datos con Spring Data JPA
└── service/      # Lógica de acceso y operaciones de productos

src/main/resources/
├── application.properties
└── static/       # HTML, CSS, JavaScript e imágenes del frontend
```