const { Pool } = require('pg'); // PostgreSQL bağlantısı için

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

const createStudent = async ({ isim, soyisim, tc_kimlik, adres }) => {
  const result = await pool.query(
    `INSERT INTO student (isim, soyisim, tc_kimlik, adres) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [isim, soyisim, tc_kimlik, adres]
  );
  return result.rows[0];
};

const getAllStudents = async () => {
  const result = await pool.query('SELECT * FROM student ORDER BY id ASC');
  return result.rows;
};

const getStudentById = async (id) => {
  console.log('Repository - Gelen id:', id);
  const result = await pool.query('SELECT * FROM student WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

const updateStudent = async (id, { isim, soyisim, tc_kimlik, adres }) => {
  const result = await pool.query(
    `UPDATE student 
     SET isim = $1, soyisim = $2, tc_kimlik = $3, adres = $4 
     WHERE id = $5 RETURNING *`,
    [isim, soyisim, tc_kimlik, adres, id]
  );
  return result.rows[0];
};

const deleteStudent = async (id) => {
  const result = await pool.query('DELETE FROM student WHERE id = $1 RETURNING *', [id]);
  return result.rows[0]; // sadece silinen satırı döndür
};

// Diğer dosyalar tarafından erişilebilmeleri için export edilir
module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
