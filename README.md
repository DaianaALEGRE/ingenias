
# Trailerflix - API de gestión de trailers y actores

## Descripción
Trailerflix es una API RESTful que permite gestionar información sobre trailers, actores, géneros, categorías y etiquetas, incluyendo relaciones entre ellos. Ideal para una plataforma estilo catálogo de contenidos audiovisuales.

## Tecnologías utilizadas
- Node.js + Express
- Sequelize
- MySQL
- Dotenv para configuración

## Estructura del proyecto

```
├── config/
├── models/
├── Public/
├── routes/
├── views/
├── server.js
├── .env
├── package.json
└── README.md
```

## Rutas disponibles (backend)

### Actores
- `GET /actores`: lista todos los actores
- `GET /actores?nombre=pedro pascal`: busca actor por nombre (búsqueda parcial)
- `GET /reparto/:act`: busca trailers donde aparece ese actor

### Trailers
- `GET /trailers`: lista todos los trailers
- `GET /trailer/:id`: detalle de un trailer específico

### Géneros
- `GET /generos`: lista todos los generos

### Categorías
- `GET /categoria/:cat`: busca trailers por categoría (búsqueda parcial)

## Relaciones entre tablas
- Un actor puede participar en muchos trailers (relación N:M)
- Un trailer puede tener múltiples géneros, categorías y tags (relación N:M)

## Cómo ejecutar localmente

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear archivo `.env` con la configuración de la base de datos y puerto:
   ```
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_de_la_base
   PORT=3008
   ```
4. Iniciar el servidor:
   ```bash
   node server.js
   ```

---
