/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from './types';

export const QUESTIONS: Question[] = [
  // BENCANA TANAH (Green)
  {
    id: 'T1',
    theme: 'Bencana Tanah',
    question: 'Lantai goyang-goyang! Seperti ada gempa. Kita harus sembunyi di mana ya? 🏠',
    options: [
      '🏃 Lari ke dekat kaca jendela.',
      '🛡️ Sembunyi di bawah meja yang kuat.',
      '📢 Berdiri di samping lemari besar.'
    ],
    correctAnswer: 1,
    explanation: 'Hebat! Meja melindungimu dari benda jatuh. Kamu anak pintar! 🛡️'
  },
  {
    id: 'T2',
    theme: 'Bencana Tanah',
    question: 'Ada banyak abu dari gunung! Supaya napas tidak sesak, pakai apa ya? 🌋',
    options: [
      '🎭 Pakai topeng pesta.',
      '😷 Pakai masker yang bersih.',
      '🕶️ Pakai kacamata hitam.'
    ],
    correctAnswer: 1,
    explanation: 'Pintar! Masker menjaga hidungmu tetap bersih dari abu gunung. 😷'
  },
  {
    id: 'T3',
    theme: 'Bencana Tanah',
    question: 'Tanah di bukit mulai turun (longsor). Kita harus lari ke mana? ⛰️',
    options: [
      '🏃 Lari ke tempat yang rata and jauh dari bukit.',
      '🏠 Diam saja di dalam rumah dekat bukit.',
      '🌳 Bermain di bawah pohon di lereng bukit.'
    ],
    correctAnswer: 0,
    explanation: 'Luar biasa! Menjauh dari bukit adalah cara paling aman. 🏃'
  },
  {
    id: 'T4',
    theme: 'Bencana Tanah',
    question: 'Ada gempa besar di pantai! Air laut tiba-tiba hilang. Ayo lari ke mana? 🚨',
    options: [
      '🐚 Ke tengah laut cari ikan.',
      '🧗 Lari ke atas bukit yang tinggi!',
      '📸 Foto-foto di pinggir laut.'
    ],
    correctAnswer: 1,
    explanation: 'Betul! Kalau air laut surut setelah gempa, lari ke atas bukit secepatnya! 🧗'
  },

  // BENCANA AIR (Blue)
  {
    id: 'A1',
    theme: 'Bencana Air',
    question: 'Ada banjir di depan rumah! Bolehkah kita berenang di air banjir? 🌊',
    options: [
      '⚽ Boleh, seru main bareng teman.',
      '🚫 Tidak boleh! Airnya kotor and banyak kuman.',
      '🐟 Boleh kalau ada ikan lewat.'
    ],
    correctAnswer: 1,
    explanation: 'Cerdas! Air banjir itu kotor. Lebih baik main di dalam rumah yang bersih. 🌊'
  },
  {
    id: 'A2',
    theme: 'Bencana Air',
    question: 'Hujan lebat sekali! Selokan penuh air. Bolehkah kita main di sana? ⛈️',
    options: [
      '👟 Boleh, airnya deras and seru.',
      '🚫 Jangan! Nanti bisa terpeleset and hanyut.',
      '⛵ Boleh buat balapan kapal kertas.'
    ],
    correctAnswer: 1,
    explanation: 'Tepat! Selokan saat hujan sangat bahaya. Jangan didekati ya! ⛈️'
  },
  {
    id: 'A3',
    theme: 'Bencana Air',
    question: 'Air banjir masuk ke rumah! Barang-barang harus ditaruh di mana? 🏠',
    options: [
      '⏫ Taruh di tempat yang tinggi or atas meja.',
      '📉 Biarkan saja di atas lantai.',
      '📥 Masukkan ke dalam air supaya bersih.'
    ],
    correctAnswer: 0,
    explanation: 'Hebat! Menyimpan barang di tempat tinggi biar tidak rusak kena air. ⏫'
  },
  {
    id: 'A4',
    theme: 'Bencana Air',
    question: 'Pohon apa yang bisa menjaga pantai agar tidak dimakan ombak? 🌿',
    options: [
      '🍭 Pohon permen cokelat.',
      '🌳 Pohon Bakau (Mangrove) yang kuat.',
      '🌵 Pohon kaktus berduri.'
    ],
    correctAnswer: 1,
    explanation: 'Luar biasa! Pohon Bakau punya akar kuat untuk jaga pantai kita. 🌿'
  },

  // BENCANA API (Red)
  {
    id: 'F1',
    theme: 'Bencana Api',
    question: 'Ada asap banyak sekali! Biar bisa napas, jalannya harus bagaimana? 🔥',
    options: [
      '🏃 Lari sambil lompat-lompat.',
      '🐈 Merangkak rendah di lantai (seperti kucing).',
      '🧍 Berdiri tegak setinggi mungkin.'
    ],
    correctAnswer: 1,
    explanation: 'Benar! Udara bersih ada di bawah. Merangkaklah biar napas tetap lega! 🐈'
  },
  {
    id: 'F2',
    theme: 'Bencana Api',
    question: 'Waduh! Ada api di dapur. Siapa yang harus segera kita panggil? 👨‍🚒',
    options: [
      '🧸 Panggil boneka kesayangan.',
      '📢 Panggil Ayah, Ibu, or orang dewasa!',
      '🐈 Panggil kucing di depan rumah.'
    ],
    correctAnswer: 1,
    explanation: 'Hebat! Orang dewasa tahu cara memadamkan api dengan aman. 📢'
  },
  {
    id: 'F3',
    theme: 'Bencana Api',
    question: 'Udara di luar banyak asap kebakaran hutan. Kita harus apa? 😷',
    options: [
      '😷 Pakai masker and main di dalam rumah saja.',
      '🚴 Pergi naik sepeda di luar rumah.',
      '🧺 Membantu menjemur baju di luar.'
    ],
    correctAnswer: 0,
    explanation: 'Pintar! Masker and rumah menjagamu dari asap yang tidak sehat. 😷'
  },
  {
    id: 'F4',
    theme: 'Bencana Api',
    question: 'Matahari sangat terik dan sudah lama tidak turun hujan. Sumur mulai kering dan tanaman layu. Apa yang harus kita lakukan agar air tidak cepat habis? ☀️',
    options: [
      '🚰 Menggunakan air sedikit-sedikit dan menutup keran rapat.',
      '🚿 Mandi lama-lama biar badan segar terus.',
      '🌊 Main semprot-semprotan air di halaman rumah.'
    ],
    correctAnswer: 0,
    explanation: 'Hebat! Saat kemarau panjang (kekeringan), kita harus sangat hemat air supaya semua orang kebagian. 💧'
  },

  // BENCANA UDARA (Yellow)
  {
    id: 'U1',
    theme: 'Bencana Udara',
    question: 'Suara petir kencang sekali! "DUARR!" Di mana kita harus berlindung? ⚡',
    options: [
      '🌳 Di bawah pohon yang tinggi.',
      '🏠 Di dalam rumah yang aman.',
      '⚽ Di tengah lapangan bola.'
    ],
    correctAnswer: 1,
    explanation: 'Tepat! Di dalam rumah, kita aman dari petir and hujan. 🏠'
  },
  {
    id: 'U2',
    theme: 'Bencana Udara',
    question: 'Ada angin besar berputar (Puting Beliung). Jauhi apa ya? 🌪️',
    options: [
      '🪟 Jendela kaca and benda yang mudah jatuh.',
      '🧸 Boneka and mainan di kamar.',
      '🍚 Piring nasi di meja makan.'
    ],
    correctAnswer: 0,
    explanation: 'Cerdas! Kaca bisa pecah or benda bisa jatuh kena angin. Jauhi ya! 🪟'
  },
  {
    id: 'U3',
    theme: 'Bencana Udara',
    question: 'Musim panas lama sekali, air susah dicari. Kita harus hemat apa? 💧',
    options: [
      '🎮 Hemat baterai mainan.',
      '🚰 Hemat air and tutup keran yang terbuka.',
      '📖 Hemat kertas buku gambar.'
    ],
    correctAnswer: 1,
    explanation: 'Langkah bijak! Air segar sangat penting saat kemarau panjang. 💧'
  }
];

export interface SpecialCard {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'CHALLENGE' | 'SAFETY';
}

export const CHALLENGE_CARDS: SpecialCard[] = [
  { id: 'C1', title: 'Misi Banjir!', description: 'Oh tidak! Ada seekor kucing terjebak di atas atap saat banjir. Ayo regu penyelamat, bantu evakuasi kucing tersebut ke tempat aman!', points: 3, type: 'CHALLENGE' },
  { id: 'C2', title: 'Misi Dapur Umum!', description: 'Pengungsi sedang lapar! Kelompokmu harus membantu menyiapkan 10 kotak makanan dengan cepat dan bersih.', points: 3, type: 'CHALLENGE' },
  { id: 'C3', title: 'Benteng Pasir!', description: 'Air laut mulai naik! Susun barikade karung pasir setinggi mungkin untuk melindungi perumahan warga.', points: 4, type: 'CHALLENGE' },
  { id: 'C4', title: 'Pesan Rahasia!', description: 'Gunakan cermin atau suara peluit untuk mengirim sinyal minta tolong kepada helikopter penyelamat di langit!', points: 4, type: 'CHALLENGE' },
  { id: 'C5', title: 'Evakuasi Lansia!', description: 'Bantu kakek dan nenek berjalan menuju gedung pengungsian paling tinggi sebelum air banjir semakin naik!', points: 5, type: 'CHALLENGE' },
  { id: 'C6', title: 'Padamkan Api!', description: 'Ada percikan api kecil di semak-semak. Gunakan pasir dan air untuk memadamkannya sebelum merembet ke hutan!', points: 5, type: 'CHALLENGE' },
];

export const SAFETY_CARDS: SpecialCard[] = [
  { id: 'S1', title: 'Hadiah Persiapan!', description: 'Keluargamu sudah menyiapkan Tas Siaga Bencana dengan lengkap.', points: 1, type: 'SAFETY' },
  { id: 'S2', title: 'Zona Aman!', description: 'Rumahmu berada di zona yang sangat aman dari bencana longsor.', points: 2, type: 'SAFETY' },
  { id: 'S3', title: 'Bantuan Tiba!', description: 'Pemerintah memberikan paket bantuan sembako untuk keluarga pahlawan.', points: 3, type: 'SAFETY' },
  { id: 'S4', title: 'Pohon Mangrove!', description: 'Tanaman bakau yang kamu tanam dulu berhasil menahan ombak besar.', points: 4, type: 'SAFETY' },
  { id: 'S5', title: 'Sertifikat Pahlawan!', description: 'Kamu mendapat penghargaan sebagai Siswa Paling Sigap tahun ini!', points: 5, type: 'SAFETY' },
];
