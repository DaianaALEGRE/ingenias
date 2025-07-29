import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';

dotenv.config();

function checkNull(value) {
  return value === undefined || value === null || value === 'N/A' ? null : value;
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

  // Insertar categorías únicas
  const categorias = [...new Set(trailers.map(t => t.categoria))];
  for (const nombre of categorias) {
    await connection.execute('INSERT IGNORE INTO categorias (nombre) VALUES (?)', [nombre]);
  }

  // Insertar géneros únicos
  const generosSet = new Set();
  trailers.forEach(t => {
    if (t.tags) {
      t.tags.split(',').forEach(g => generosSet.add(g.trim()));
    }
    if (t.genero) {
      generosSet.add(t.genero.trim());
    }
  });
  const generos = [...generosSet];
  for (const nombre of generos) {
    await connection.execute('INSERT IGNORE INTO generos (nombre) VALUES (?)', [nombre]);
  }

  // Mapas de ID
  const [catsRows] = await connection.query('SELECT * FROM categorias');
  const categoriaMap = Object.fromEntries(catsRows.map(cat => [cat.nombre, cat.id]));

  const [genRows] = await connection.query('SELECT * FROM generos');
  const generoMap = Object.fromEntries(genRows.map(g => [g.nombre, g.id]));

  for (const t of trailers) {
    const categoria_id = categoriaMap[t.categoria];
    const duracion = parseInt(t.duracion) || null;
    const temporadas = isNaN(parseInt(t.temporadas)) ? null : parseInt(t.temporadas);
    const resumen = t.resumen || '';
    const trailer = t.trailer || '';

    const [carteleraRes] = await connection.execute(
      `INSERT INTO cartelera (id, poster, titulo, categoria_id, temporadas, resumen, trailer, duracion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.id, t.poster, t.titulo, categoria_id, temporadas, resumen, trailer, duracion]
    );

    // Insertar tags
    if (t.tags) {
      const tags = t.tags.split(',').map(tag => tag.trim());
      for (const tagNombre of tags) {
        await connection.execute('INSERT IGNORE INTO tags (nombre) VALUES (?)', [tagNombre]);
        const [tagRow] = await connection.query('SELECT id FROM tags WHERE nombre = ?', [tagNombre]);
        const tagId = tagRow[0].id;
        await connection.execute('INSERT IGNORE INTO titulos_tags (titulo_id, tag_id) VALUES (?, ?)', [t.id, tagId]);

        // Insertar también en titulos_generos si aplica
        if (generoMap[tagNombre]) {
          await connection.execute('INSERT IGNORE INTO titulos_generos (titulo_id, genero_id) VALUES (?, ?)', [t.id, generoMap[tagNombre]]);
        }
      }
    }

    // Insertar actor y reparto
    if (t.reparto) {
      const actores = t.reparto.split(',').map(a => a.trim());
      for (const actor of actores) {
        await connection.execute('INSERT IGNORE INTO actores (nombre) VALUES (?)', [actor]);
        const [actorRow] = await connection.query('SELECT id FROM actores WHERE nombre = ?', [actor]);
        const actorId = actorRow[0].id;
        await connection.execute('INSERT IGNORE INTO reparto (titulo_id, actor_id) VALUES (?, ?)', [t.id, actorId]);
      }
    }

    // Insertar género principal (si lo tiene) como relación
    if (t.genero && generoMap[t.genero]) {
      await connection.execute('INSERT IGNORE INTO titulos_generos (titulo_id, genero_id) VALUES (?, ?)', [t.id, generoMap[t.genero]]);
    }
  }

  console.log('✅ Base de datos poblada con éxito');
  await connection.end();
}

main().catch(err => {
  console.error('❌ Error en seed:', err);
});
