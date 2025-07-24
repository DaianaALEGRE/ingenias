import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';

dotenv.config();

function checkNull(value) {
  return value === undefined ? null : value;
}

async function main() {
  // Leer JSON
  const rawData = await fs.readFile('./dataBase/trailerflix.json', 'utf-8');
  const trailers = JSON.parse(rawData);

  // Conectar a la base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  console.log('🔌 Conectado a la base de datos');


  // Insertar categorias únicas
  const categorias = [...new Set(trailers.map(t => t.categoria))];
  for (const nombre of categorias) {
    await connection.execute('INSERT IGNORE INTO categorias (nombre) VALUES (?)', [nombre]);
  }

  // Insertar generos únicos
  const generos = [...new Set(trailers.map(t => t.genero))];
  for (const nombre of generos) {
    await connection.execute('INSERT IGNORE INTO generos (nombre) VALUES (?)', [nombre]);
  }

  // Obtener mapa categoria_nombre -> id
  const [catsRows] = await connection.query('SELECT * FROM categorias');
  const categoriaMap = {};
  for (const cat of catsRows) categoriaMap[cat.nombre] = cat.id;

  // Obtener mapa genero_nombre -> id
  const [genRows] = await connection.query('SELECT * FROM generos');
  const generoMap = {};
  for (const gen of genRows) generoMap[gen.nombre] = gen.id;

  for (const t of trailers) {
    const categoria_id = categoriaMap[t.categoria];
    const genero_id = generoMap[t.genero];

    const duracion = checkNull(t.duracion) || 'N/A';
    const temporadas = isNaN(parseInt(t.temporadas)) ? 0 : parseInt(t.temporadas);
    const resumen = checkNull(t.resumen);
    const trailerUrl = checkNull(t.trailer);

    await connection.execute(
      `INSERT INTO trailers
      (id, poster, titulo, categoria_id, genero_id, resumen, temporadas, duracion, trailer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.id, t.poster, t.titulo, categoria_id, genero_id, t.resumen || '', temporadas, duracion, trailerUrl]
    );

    // Insertar tags
    if (t.tags) {
      const tags = t.tags.split(',').map(tag => tag.trim());
      for (const tagNombre of tags) {
        await connection.execute('INSERT IGNORE INTO tags (nombre) VALUES (?)', [tagNombre]);
        const [tagRow] = await connection.query('SELECT id FROM tags WHERE nombre = ?', [tagNombre]);
        const tagId = tagRow[0].id;
        await connection.execute('INSERT IGNORE INTO trailer_tags (trailer_id, tag_id) VALUES (?, ?)', [t.id, tagId]);
      }
    }

    // Insertar actores y traileractor
    if (t.reparto) {
      const actores = t.reparto.split(',').map(a => a.trim());
      for (const actorNombre of actores) {
        await connection.execute('INSERT IGNORE INTO actores (nombrecompleto) VALUES (?)', [actorNombre]);
        const [actorRow] = await connection.query('SELECT id FROM actores WHERE nombrecompleto = ?', [actorNombre]);
        const actorId = actorRow[0].id;
        await connection.execute('INSERT INTO traileractor (trailer_id, actor_id, personaje) VALUES (?, ?, ?)', [t.id, actorId, '']);
      }
    }
  }

  console.log('🎉 Base de datos poblada con éxito');
  await connection.end();
}

main().catch(err => {
  console.error('Error en seed:', err);
});
