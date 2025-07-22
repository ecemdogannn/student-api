const repository = require('../Repository/repository');
const Student = require('../Entity/entity');

const createStudent = async (studentData) => {
  const created = await repository.createStudent(studentData);
  return new Student(created);
};

const getAllStudents = async () => {
  const students = await repository.getAllStudents();
  return students.map(s => new Student(s));
};

const getStudentById = async (id) => {
  console.log('Service: Gelen id:', id);
  const studentData = await repository.getStudentById(id);
  if (!studentData) return null;
  return new Student(studentData);
};

const updateStudent = async (id, studentData) => {
  const updated = await repository.updateStudent(id, studentData);
  return new Student(updated);
};

const deleteStudent = async (id) => {
  const deleted = await repository.deleteStudent(id);
  return deleted ? true : false;
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
