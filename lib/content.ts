export const content = {
  tabTitle: "to my fav person",

  hero: {
    title: "hbd Nandaaa Noviraaa",
    subtitle: 'tiba" dah tanggal 10, makin tua ya ke akwoako',
    hint: 'tolong scroll pelan" ya',
  },

  ruler: "umur doang nambah tingginya kapan",

  messages: {
    smart: "semoga makin pinterrr, walaupun sekarang udah pinter parah si, gila orang sepinter ini suka ama aku",

    kind: "semoga menjadi pribadi yang lebih baikk, walaupun sekarang udah baikk bangett, MasyaAllah",

    feeling: "semoga apa yang diinginkan tercapaii, baik itu cita-cita or yang lainnya",

    random: "moga lancar semua prosessnya menuju sidangg, inii aku doa yaa bukan maksud nyinggung sidang",

    honest: 'dan semoga doa" ke yang lain tercapai dan dikabulkan aaamiiinnn',

    strong: "nih liat achievement ke, gokil si. when yah",
  },

  chat: [
    { from: "her", text: "ihh imuttt" },
    { from: "me", text: "kok imut si, call me cool" },
    { from: "me", sticker: "cool" },
    { from: "her", text: "cool apaan coba kek gini" },
    { from: "her", sticker: "dia" },
  ],

  journey: {
    title: "perjalanan ke",

    steps: [
      { text: "nasional silver geografi", done: true },
      { text: "juara pidato english nasional", done: true },
      { text: "kuliah di fk", done: true },
      { text: "awardee BU", done: true },
      { text: "jadi asatom", done: true },
      { text: "udah sempro di semester 6", done: true },
      { text: "sidang bentar lagi. semangattt", done: false },
      { text: "wisuda, bareng? hihihiha", done: false },
      { text: "spesialis mata?", done: false },
      { text: "edinburgh, public health, aamiin", done: false },
    ],

    proud: "soooo proud of youuuu",
    proudNote: 'even capaian" ke yang mini yaa, and ......',
  },

  alwaysThere: {
    line: "aku bakal selalu ada waktu ke sibuk (ya walaupun online) . specially when you stressed out dan menghilang, isokeyyy you know",
    flag: "that's totally not a redflag for me, i knew it's just your way to handle your stress and im fully respected it",
  },

  note: {
    // Satu item = satu baris yang muncul bergantian saat di-scroll.
    // Awali dengan "- " supaya jadi poin (pakai bunga kecil di depannya).
    lines: [
      "Intinya, selamat ulang tahun yaaa princess,\nyang baik, cantik, pintar, imut, pendek",
      "- suka seafood, suka daging",
      "- suka jajan, suka seblak, suka cheese cake",
      "- suka warna pink, maroon dan brown, specially pinknya yang hexa #FFD6E0",
      "- suka buah nanas, mangga, anggur (mangga top 1 kalo udah dikupas)",
      "- suka buku dari keigo higashino",
      "- suka anime genre mistery, action, romance and sport (kalo artnya bagus)",
      "- anime favnya haikyuu",
      "- suka jus semangka and mangga (top two kalo jus)",
      "- suka matcha (top one kalo non jus)",
      "- love languagenya quality time and giving gift, and suka banget di act of service",
      "wish you all all all all all all the besstttt.",
    ],
  },

  closing: {
    lines: ["as i always said, panjang umur and sehat selalu yaaa.", "i hope you like it, this is all from my heart:), cepat sembuh ya"],

    button: {
      label: "tekan link ini aja biar kawan aku jelasin",
      unlockAt: "2026-10-01T00:00:00+07:00",
    },

    // muncul bareng tombolnya setelah gemboknya kebuka
    robots: {
      text: "btw aku mau buat robot yang ini (nomor 1) dan kasi ke ke dan yang kedua untuk pamer, cuma...",
      images: ["robot-1.webp", "robot-2.webp"],
    },
  },
} as const;
