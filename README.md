
# Trailerflix - API de gestión de trailers y actores

## Descripción
Trailerflix es una API RESTful que permite gestionar información sobre trailers, actores, géneros, categorías y etiquetas, incluyendo relaciones entre ellos. Ideal para una plataforma estilo catálogo de contenidos audiovisuales.

## Tecnologías utilizadas
- Node.js + Express
- Sequelize
- MySQL
- Dotenv para configuración


## Base de Datos Trailerflix

El diseño fue realizado utilizando [DB Designer](./db_nueva.png) para organizar las entidades que componen una plataforma de películas y series. A continuación se detallan las tablas principales y las relaciones entre ellas.

### 📄 Tablas

#### 🎞️ `titulos`
Contiene información general de las películas o series.

- `id` (PK)
- `nombre`
- `descripcion`
- `tipo` (película/serie)
- `fecha_estreno`

Se relaciona con:
- `categorias` (FK)
- `titulos_generos` (N:N)
- `titulos_tags` (N:N)
- `reparto` (1:N)
- `ranking` (1:1)

#### 🗂️ `categorias`
Clasifica los títulos según su tipo principal (por ejemplo, película, serie, documental).

- `id` (PK)
- `nombre`

#### 🎭 `generos`
Define los géneros de los títulos (acción, drama, etc.).

- `id` (PK)
- `nombre`

#### 🏷️ `tags`
Palabras clave asociadas a los títulos.

- `id` (PK)
- `nombre`

#### 🎬 `cartelera`
Contiene la programación de títulos disponibles, incluyendo:

- `id` (PK)
- `titulo_id` (FK a `titulos`)
- `duracion` (INT, puede ser NULL)
- `fecha_inicio`
- `fecha_fin`

Permite registrar cuándo está disponible un título, su duración y otros datos temporales.

#### 👥 `actores`
Listado de personas que pueden participar en varios títulos.

- `id` (PK)
- `nombre`
- `fecha_nacimiento`

#### 👥 `reparto`
Tabla intermedia que vincula actores con títulos.

- `id` (PK)
- `actor_id` (FK)
- `titulo_id` (FK)
- `personaje` (opcional)

#### 🌟 `ranking`
Valoración de los títulos.

- `id` (PK)
- `titulo_id` (FK a `titulos`)
- `puntuacion`

#### 🔗 `titulos_generos` y `titulos_tags`
Tablas intermedias N:N para vincular múltiples géneros o tags a un mismo título.

---

### 🔁 Relaciones destacadas

- Un **título** puede tener múltiples **tags**, **géneros**, y **actores** (a través de `reparto`).
- Un **actor** puede estar en múltiples **títulos**.
- Cada **título** puede tener una única entrada en **ranking**.
- La **cartelera** determina la duración y disponibilidad de los títulos.

---

> 💡 Nota: Se permiten valores nulos en la columna `duracion` de la cartelera para casos donde no esté especificada (por ejemplo, series con duración variable).


## Estructura del proyecto backend

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

## Rutas disponibles

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
