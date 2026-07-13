import { BoardTile } from '../types';

export const BOARD_TILES: BoardTile[] = [
  // ROW 1: SUDUT & MULAI (SPECIAL)
  { id: 'tile-start', type: 'START', label: 'GO MULAI', icon: '🏁', gridX: 1, gridY: 1 },
  { id: 'tile-free-parking', type: 'CORNER', label: 'FREE PARKING', icon: '☀️', gridX: 2, gridY: 1 },
  { id: 'tile-just-visiting', type: 'CORNER', label: 'JUST VISITING', icon: '👦', gridX: 3, gridY: 1 },
  { id: 'tile-jail', type: 'JAIL', label: 'GO TO JAIL', icon: '⛈️', gridX: 4, gridY: 1 },

  // ROW 2: KATEGORI AIR (🌊)
  { id: 'tile-air-1', type: 'DISASTER', label: 'Banjir Kota', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Air', icon: '🏘️', gridX: 1, gridY: 2 },
  { id: 'tile-air-2', type: 'DISASTER', label: 'Banjir Bandang & Tsunami', subLabel: 'Susun Urutan', interactionType: 'SORT', theme: 'Bencana Air', icon: '🌊', gridX: 2, gridY: 2 },
  { id: 'tile-air-3', type: 'DISASTER', label: 'Banjir Rob', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Air', icon: '🌊', gridX: 3, gridY: 2 },
  { id: 'tile-air-4', type: 'DISASTER', label: 'Gelombang Tinggi', subLabel: 'Cerita Bercabang', interactionType: 'STORY', theme: 'Bencana Air', icon: '🌊', gridX: 4, gridY: 2 },

  // ROW 3: KATEGORI TANAH (⛰️)
  { id: 'tile-tanah-1', type: 'DISASTER', label: 'Gempa Bumi', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Tanah', icon: '🌍🫨', gridX: 1, gridY: 3 },
  { id: 'tile-tanah-2', type: 'DISASTER', label: 'Tanah Longsor', subLabel: 'Cerita Bercabang', interactionType: 'STORY', theme: 'Bencana Tanah', icon: '⛰️⚠️', gridX: 2, gridY: 3 },
  { id: 'tile-tanah-3', type: 'DISASTER', label: 'Gempa + Tsunami', subLabel: 'Susun Urutan', interactionType: 'SORT', theme: 'Bencana Tanah', icon: '🌊🫨', gridX: 3, gridY: 3 },
  { id: 'tile-tanah-4', type: 'DISASTER', label: 'Likuefaksi', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Tanah', icon: '🏚️', gridX: 4, gridY: 3 },

  // ROW 4: KATEGORI API (🔥)
  { id: 'tile-api-1', type: 'DISASTER', label: 'Gunung Berapi', subLabel: 'Susun Urutan', interactionType: 'SORT', theme: 'Bencana Api', icon: '🌋', gridX: 1, gridY: 4 },
  { id: 'tile-api-2', type: 'DISASTER', label: 'Kebakaran Rumah', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Api', icon: '🏠🔥', gridX: 2, gridY: 4 },
  { id: 'tile-api-3', type: 'DISASTER', label: 'Kebakaran Gedung', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Api', icon: '🏢🔥', gridX: 3, gridY: 4 },
  { id: 'tile-api-4', type: 'DISASTER', label: 'Kebakaran Hutan', subLabel: 'Susun Urutan', interactionType: 'SORT', theme: 'Bencana Api', icon: '🌲🔥', gridX: 4, gridY: 4 },
  { id: 'tile-kekeringan', type: 'DISASTER', label: 'Kekeringan Ekstrem', subLabel: 'Cerita Bercabang', interactionType: 'STORY', theme: 'Bencana Api', icon: '☀️🔥', isSpecial: true, gridX: 1, gridY: 5 },

  // ROW 5: KATEGORI UDARA (🌪️)
  { id: 'tile-udara-1', type: 'DISASTER', label: 'Angin Puting Beliung', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Udara', icon: '🌪️', gridX: 1, gridY: 5 },
  { id: 'tile-udara-2', type: 'DISASTER', label: 'Badai Petir', subLabel: 'Susun Urutan', interactionType: 'SORT', theme: 'Bencana Udara', icon: '⛈️', gridX: 2, gridY: 5 },
  { id: 'tile-udara-3', type: 'DISASTER', label: 'Angin Kencang', subLabel: 'Pilih Jawaban', interactionType: 'ANSWER', theme: 'Bencana Udara', icon: '🌬️', gridX: 3, gridY: 5 },
  { id: 'tile-udara-4', type: 'DISASTER', label: 'Hujan Ekstrem', subLabel: 'Susun Urutan', interactionType: 'SORT', theme: 'Bencana Udara', icon: '🌧️', gridX: 4, gridY: 5 },

  // ROW 6: KARTU TANTANGAN
  { id: 'tile-chan-1', type: 'CHALLENGE', label: 'Kartu Tantangan', subLabel: 'Tugas Sigap', interactionType: 'SORT', icon: '❓', gridX: 1, gridY: 6 },
  { id: 'tile-chan-2', type: 'CHALLENGE', label: 'Kartu Tantangan', subLabel: 'Misi Rahasia', interactionType: 'ANSWER', icon: '❓', gridX: 2, gridY: 6 },
  { id: 'tile-chan-3', type: 'CHALLENGE', label: 'Kartu Tantangan', subLabel: 'Aksi Nyata', interactionType: 'STORY', icon: '📦', gridX: 3, gridY: 6 },
  { id: 'tile-chan-4', type: 'CHALLENGE', label: 'Kartu Tantangan', subLabel: 'Kerjasama Tim', interactionType: 'SORT', icon: '❓', gridX: 4, gridY: 6 },

  // ROW 7: KARTU SELAMAT & BONUS
  { id: 'tile-saf-1', type: 'SAFETY', label: 'Kartu Selamat', subLabel: 'Majukan 2', interactionType: 'SORT', icon: '🛡️', gridX: 1, gridY: 7 },
  { id: 'tile-saf-2', type: 'SAFETY', label: 'Pos Aman', subLabel: 'Dapat Bintang', interactionType: 'ANSWER', icon: '🏥', gridX: 2, gridY: 7 },
  { id: 'tile-bon-1', type: 'BONUS', label: 'Bonus: Tas Siaga', subLabel: 'Abrasi Pantai', bonusDescription: 'Bonus 2 Bintang!', points: 2, icon: '🏖️', isSpecial: true, gridX: 3, gridY: 7 },
  { id: 'tile-bon-2', type: 'BONUS', label: 'Bonus: Pos Aman', subLabel: 'Hutan Bakau', bonusDescription: 'Bonus 2 Bintang!', points: 2, icon: '🏥', isSpecial: true, gridX: 4, gridY: 7 },

  // ROW 8: KEJUTAN & AKHIR
  { id: 'tile-chance-rand', type: 'CHANCE', label: 'Chance', subLabel: 'Nasib Beruntung?', icon: '❓', gridX: 1, gridY: 8 },
  { id: 'tile-mundur-akhir', type: 'MUNDUR', label: 'Mundur 1 Kotak', subLabel: 'Tetap Semangat', icon: '🏃', gridX: 2, gridY: 8 },
  { id: 'tile-sub-tanah', type: 'DISASTER', label: 'Subsidensi Tanah', subLabel: 'Tanah Turun', interactionType: 'STORY', theme: 'Bencana Tanah', icon: '⚠️', gridX: 3, gridY: 8 },
];
