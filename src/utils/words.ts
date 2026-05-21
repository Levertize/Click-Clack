export const englishWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
  'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
  'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some',
  'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'should', 'here', 'thing', 'must', 'through', 'mean', 'both', 'between', 'high', 'under',
  'never', 'much', 'great', 'same', 'another', 'own', 'leave', 'leave', 'right', 'place', 'old', 'too', 'write', 'world',
  'small', 'find', 'social', 'house', 'extra', 'light', 'sound', 'color', 'visual', 'typing', 'aesthetic', 'keyboard',
  'switch', 'particle', 'matrix', 'design', 'retro', 'cyber', 'minimal', 'vivid', 'ocean', 'sakura', 'synthwave'
]

export const indonesianWords = [
  'yang', 'dan', 'di', 'dengan', 'untuk', 'tidak', 'ini', 'itu', 'saya', 'kita', 'mereka', 'dia', 'kami', 'anda', 'ada',
  'bisa', 'akan', 'dari', 'ke', 'pada', 'seperti', 'atau', 'hanya', 'juga', 'lebih', 'telah', 'oleh', 'secara', 'karena',
  'bahwa', 'harus', 'sangat', 'dalam', 'banyak', 'orang', 'lagi', 'baru', 'satu', 'dua', 'tiga', 'hari', 'tahun', 'kembali',
  'menggunakan', 'masih', 'dapat', 'tanpa', 'setelah', 'sebelum', 'agar', 'supaya', 'kemudian', 'lalu', 'namun', 'tetapi',
  'saja', 'jika', 'kalau', 'ketika', 'saat', 'maka', 'hingga', 'sampai', 'bahkan', 'tentang', 'melihat', 'tahu', 'mengerti',
  'ingin', 'mau', 'perlu', 'kerja', 'jalan', 'datang', 'pergi', 'membuat', 'membawa', 'memiliki', 'lihat', 'coba', 'mulai',
  'selesai', 'tanya', 'jawab', 'baca', 'tulis', 'buku', 'rumah', 'waktu', 'kata', 'hidup', 'pikir', 'rasa', 'cinta', 'hati',
  'indah', 'estetik', 'ketik', 'papan', 'suara', 'partikel', 'warna', 'cahaya', 'dunia', 'udara', 'malam', 'pagi', 'siang'
]

export function generateWordList(lang: 'english' | 'indonesian', count: number = 100): string[] {
  const words = lang === 'indonesian' ? indonesianWords : englishWords
  const result: string[] = []
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length)
    result.push(words[randomIndex])
  }
  
  return result
}
