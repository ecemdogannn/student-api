const express = require('express');
const studentService = require('../Service/service');

const app = express();
app.use(express.json());

app.post('/student', async (req, res) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {
      res.status(400).send('Bu TC kimlik zaten kayıtlı.');
    } else {
      res.status(500).send('Sunucu hatası');
    }
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log('Controller: ID:', id);

    if (isNaN(id)) {
      return res.status(400).send('Geçersiz ID');
    }

    const student = await studentService.getStudentById(id);

    if (!student) {
      return res.status(404).send('Öğrenci bulunamadı');
    }

    res.json(student);
  } catch (err) {
    console.error('Hata:', err.message);
    res.status(500).send('Sunucu hatası');
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const studentData = req.body;
    const updatedStudent = await studentService.updateStudent(id, studentData);
    res.json(updatedStudent);
  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {
      res.status(400).send('Bu TC kimlik zaten kayıtlı.');
    } else {
      res.status(500).send('Sunucu hatası');
    }
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await studentService.deleteStudent(id);
    if (!deleted) return res.status(404).send('Öğrenci bulunamadı');
    res.send('Öğrenci silindi');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
