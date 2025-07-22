class Student {
  constructor({ id, isim, soyisim, tc_kimlik, adres }) {
    this.id = id;
    this.isim = isim;
    this.soyisim = soyisim;
    this.tc_kimlik = tc_kimlik;
    this.adres = adres;
  }
}

module.exports = Student;
