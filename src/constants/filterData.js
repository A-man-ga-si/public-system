export const hargaJasa = {
    operator: {
      '< 1 Tahun': { min: 500000, max: 1000000 },
      '1 Tahun': { min: 700000, max: 1200000 },
      '2-3 Tahun': { min: 1000000, max: 1800000 },
      '5 Tahun': { min: 1500000, max: 2500000 },
      '> 5 Tahun': { min: 2000000, max: 3500000 },
    },
    'teknisi-analisis': {
      '< 1 Tahun': { min: 700000, max: 1500000 },
      '1 Tahun': { min: 1000000, max: 2000000 },
      '2-3 Tahun': { min: 1500000, max: 2500000 },
      '5 Tahun': { min: 1800000, max: 3500000 },
      '> 5 Tahun': { min: 2000000, max: 4500000 },
    },
    profesional: {
      '< 1 Tahun': { min: 1000000, max: 2000000 },
      '1 Tahun': { min: 1500000, max: 3000000 },
      '2-3 Tahun': { min: 2000000, max: 4000000 },
      '5 Tahun': { min: 2000000, max: 5000000 },
      '> 5 Tahun': { min: 2500000, max: 6000000 },
    },
  };
  
  export const locations = [
    { value: 'semua-lokasi', label: 'Semua Lokasi' },
    { value: 'jakarta', label: 'Jakarta' },
    { value: 'bandung', label: 'Bandung' },
    { value: 'surabaya', label: 'Surabaya' },
    { value: 'medan', label: 'Medan' },
    { value: 'makassar', label: 'Makassar' },
    { value: 'denpasar', label: 'Denpasar' },
    { value: 'yogyakarta', label: 'Yogyakarta' },
    { value: 'semarang', label: 'Semarang' },
    { value: 'palembang', label: 'Palembang' },
    { value: 'balikpapan', label: 'Balikpapan' },
    { value: 'pontianak', label: 'Pontianak' },
    { value: 'manado', label: 'Manado' },
    { value: 'batam', label: 'Batam' },
    { value: 'padang', label: 'Padang' },
  ];
  
  export const skills = [
    { value: 'arsitektur', label: 'Arsitektur' },
    { value: 'sipil', label: 'Sipil' },
    { value: 'mekanikal', label: 'Mekanikal' },
    { value: 'tata_lingkungan', label: 'Tata Lingkungan' },
    { value: 'manajemen_pelaksanaan', label: 'Manajemen Pelaksanaan' },
    { value: 'arsitektur_lanskap', label: 'Arsitektur Lanskap, Iluminasi & Desain Interior' },
    { value: 'perencanaan_wilayah_kota', label: 'Perencanaan Wilayah & Kota' },
    { value: 'sains_rekayasa_teknik', label: 'Sains & Rekayasa Teknik' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  export const skkLevels = [
    { value: 'operator', label: 'Operator' },
    { value: 'teknisi-analisis', label: 'Teknisi - Analisis' },
    { value: 'profesional', label: 'Profesional' },
  ];