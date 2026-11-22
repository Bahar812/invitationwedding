// Semua konten undangan diatur dari file ini. Ganti sesuai kebutuhan.
// Foto ada di frontend/public/photos
const P = {
  toga: '/photos/toga.png',
  duduk: '/photos/duduk.png',
  selempang: '/photos/selempang.png',
  punggung: '/photos/punggung.png',
  berdiri: '/photos/berdiri.png',
};

export const invitation = {
  groom: {
    nick: 'Fikri',
    name: 'Noer Fikri Arrosyid',
    // Potret dipotong dari foto berdua (zoom + titik fokus)
    photo: P.duduk,
    zoom: 1.9,
    focus: '70% 42%',
    parents: 'Putra dari Bapak M. Sholeh & Ibu Masripah',
    instagram: 'https://instagram.com/',
  },
  bride: {
    nick: 'Tasya',
    name: 'Aprillia Tasya Salsabilah',
    photo: P.selempang,
    zoom: 2.2,
    focus: '15% 50%',
    parents: 'Putri dari Bapak (Alm) Sahroni & Ibu Suryani',
    instagram: 'https://instagram.com/',
  },
  coverPhoto: P.punggung,
  closingPhoto: P.berdiri,
  // Waktu akad (zona WIB)
  date: '2026-12-28T08:00:00+07:00',
  dateText: 'Senin, 28 Desember 2026',
  intro:
    'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami.',
  quote: {
    text: '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."',
    source: '(Qs. Ar-Rum : 21)',
  },
  events: [
    {
      title: 'Akad Nikah',
      date: 'Senin, 28 Desember 2026',
      time: 'Pukul : 08.00 WIB',
      place: 'KEDIAMAN MEMPELAI WANITA',
      address: 'Pasuruan,\nJawa Timur',
      map: 'https://maps.google.com/?q=Pasuruan',
    },
    {
      title: 'Resepsi',
      date: 'Senin, 28 Desember 2026',
      time: 'Pukul : 10.00 WIB – Selesai',
      place: 'KEDIAMAN MEMPELAI WANITA',
      address: 'Pasuruan,\nJawa Timur',
      map: 'https://maps.google.com/?q=Pasuruan',
    },
  ],
  live: {
    text: 'Kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan pernikahan kami secara virtual yang disiarkan langsung melalui media sosial di bawah ini',
    time: 'Pukul : 08.00 WIB',
    label: '@Fikri',
    url: 'https://instagram.com/',
  },
  gift: {
    text: 'Doa restu Anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.',
    accounts: [
      { bank: 'BCA', number: '1234567890', name: 'Noer Fikri Arrosyid' },
      { bank: 'BRI', number: '0987654321', name: 'Aprillia Tasya Salsabilah' },
    ],
  },
  video: 'dQw4w9WgXcQ', // ID video YouTube (ganti dengan video prewedding)
  gallery: [P.toga, P.duduk, P.selempang, P.punggung, P.berdiri],
  story: {
    title: 'Love Story',
    subtitle: 'Dari Sidang Sampai Sah',
    photo: P.toga,
    items: [
      {
        title: 'Dipertemukan di Forum Sidang',
        text: 'Awalnya tidak ada yang menyangka, jodoh justru dipertemukan di forum formal. Fikri ditugaskan oleh PC PMII Pasuruan menjadi Presidium Sidang di Universitas Merdeka Pasuruan, datang dengan kemeja rapi, map sidang, dan palu sidang di tangan. Tasya hadir sebagai peserta. Baginya, Fikri hanyalah "Kak Presidium" yang tegas, sedikit kaku, tapi berwibawa. Selesai sidang, tak ada obrolan lebih.',
      },
      {
        title: 'Ajakan Mengenal Lebih Dalam',
        text: 'Takdir ternyata tidak selesai di palu ketuk tiga kali. Jelang satu minggu setelah sidang, Fikri mengajak Tasya keluar. "Bisa keluar gak entah nonton kek atau apa? Sekadar ingin mengenal lebih dalam."',
      },
      {
        title: 'Obrolan di Warung Kopi',
        text: 'Dari yang awalnya canggung membahas AD/ART dan PMII, obrolan melebar ke keluarga, mimpi, dan cita-cita setelah berproses. Di warung kopi sederhana itu Tasya sadar, di balik tegasnya seorang presidium ada sosok yang sangat menghargai perempuan dan punya visi masa depan yang jelas. Sejak hari itu, mereka tak lagi bicara tentang persidangan, tapi tentang masa depan.',
      },
      {
        title: 'Niat yang Tulus',
        text: 'Tanpa romansa berlebihan, Fikri datang secara pribadi ke rumah. Duduk sopan di hadapan orang tua Tasya, tanpa kata-kata puitis, ia hanya berkata, "Saya ingin menyempurnakan separuh agama bersama putri Ibu." Air mata haru pun tak terbendung.',
      },
      {
        title: 'SAH',
        text: 'Dan hari ini, cerita itu berakhir dengan satu kata yang paling indah: SAH. Dari yang awalnya dipertemukan karena tugas organisasi, kini dipertemukan untuk sehidup semati. Terima kasih, PMII, kalian menjadi saksi awal cinta kami.',
      },
    ],
  },
  closing:
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',
  // Taruh file musik di frontend/public/music.mp3
  music: '/music.mp3',
};
