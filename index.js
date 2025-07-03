const express = require('express'); // Express framework'ünü projeye dahil et (web sunucusu için)
const pool = require('./db'); // db.js den posgresql bağlantısı alıyoruz
const app = express(); // express uygulaması başlar
app.use(express.json()); //json verisini javascript nesnesine çevir


// CREATE- Yeni öğrenci ekle
app.post('/students', async (req, res) => { // yeni bir öğrenci kaydı ekle
  const { isim, soyisim, tc_kimlik, adres } = req.body; //değişkenlere ata 
  try {
    const result = await pool.query( // postgresql sorgu göndermek için 
      `INSERT INTO student (isim, soyisim, tc_kimlik, adres) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [isim, soyisim, tc_kimlik, adres]
    );
    res.json(result.rows[0]); //yeni oluşturulan öğrenci verisi, ID gibi otomatik atanan bilgiler dahil olmak üzere istemciye döner.
  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {  // UNIQUE violation (benzersiz alanın tekrar edilmesi)
      res.status(400).send('Bu TC kimlik zaten kayıtlı.');
    } else {
      res.status(500).send('Sunucu hatası');
    }
  }
});

// READ — Tüm öğrencileri getir
app.get('/students', async (req, res) => { // GET isteği ile /students, tüm öğrencileri listele
  try {
    const result = await pool.query('SELECT * FROM student ORDER BY id ASC'); // Tüm öğrencileri ID'ye göre sırala ve getir
    res.json(result.rows); // Tüm öğrenci satırlarını JSON dizisi olarak cevapla
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

// READ — ID’ye göre tek öğrenci getir
app.get('/students/:id', async (req, res) => { //get isteği ile /students/ID, ID'ye göre öğrenci getir
  const { id } = req.params; //url parametresini al 
  try {
    const result = await pool.query('SELECT * FROM student WHERE id = $1', [id]); //id ye göre öğrenci getir
    if (result.rows.length === 0) { // eğer öğrenci yoksa
      return res.status(404).send('Öğrenci bulunamadı');
    }
    res.json(result.rows[0]); // bulunan öğrenciyi döndür
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

// UPDATE — Öğrenci güncelle
app.put('/students/:id', async (req, res) => { //put ile güncelle
  const { id } = req.params; // güncellencek id yi al
  const { isim, soyisim, tc_kimlik, adres } = req.body;
  try {
    const result = await pool.query(
      `UPDATE student 
       SET isim = $1, soyisim = $2, tc_kimlik = $3, adres = $4 
       WHERE id = $5 RETURNING *`, //veriyi güncelle güncelleneni döndür
      [isim, soyisim, tc_kimlik, adres, id]
    );
    if (result.rows.length === 0) { //yoksa
      return res.status(404).send('Öğrenci bulunamadı');
    }
    res.json(result.rows[0]); //bulunannı döndür
  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {   // tc kimlik tekrarı unıque hatası
      res.status(400).send('Bu TC kimlik zaten kayıtlı.');
    } else {
      res.status(500).send('Sunucu hatası');
    }
  }
});

// DELETE — Öğrenci sil
app.delete('/students/:id', async (req, res) => { // delete ile id seçilen öğrenciyi sil
  const { id } = req.params; //silinecek öğrenci id si al
  try {
    const result = await pool.query('DELETE FROM student WHERE id = $1 RETURNING *', [id]); //öğrenciyi sil ve satırı döndür
    if (result.rows.length === 0) { //öğrenci yoksa
      return res.status(404).send('Öğrenci bulunamadı');
    }
    res.send('Öğrenci silindi'); //bulunanı döndür
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

// Sunucuyu başlat
app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});

