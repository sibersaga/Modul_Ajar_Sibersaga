import { ModulAjarData } from '../types';

export interface LkpdPromptOptions {
  activityType?: 'campuran' | 'individu' | 'kelompok' | 'luar_kelas';
  questionCount?: number;
  difficultyLevel?: 'sesuai_fase' | 'mudah' | 'menantang_hots';
  additionalFocus?: string;
}

/**
 * Automatically builds a rich, context-aware prompt for LKPD generation
 * strictly based on the provided Modul Ajar data.
 */
export function buildLkpdPrompt(
  data: ModulAjarData,
  options: LkpdPromptOptions = {}
): string {
  const {
    activityType = 'campuran',
    questionCount = 5,
    difficultyLevel = 'sesuai_fase',
    additionalFocus = '',
  } = options;

  const jenjang = data.jenjang || 'SD';
  const kelas = data.kelas || 'Kelas 1';
  const fase = data.fase || 'A';
  const tema = data.temaSubtema || 'Tema Pembelajaran';
  const topik = data.topikPembelajaran || 'Topik Kegiatan';
  const materi = data.materiPembelajaran || 'Materi Pokok Pembelajaran';
  const tujuan = data.tujuanPembelajaran || 'Tujuan Pembelajaran';
  const elemenCp = data.elemenCp || 'Capaian Pembelajaran';
  const dimensiP3 = (data.dimensiProfilLulusan || []).length > 0
    ? data.dimensiProfilLulusan.join(', ')
    : 'Penalaran Kritis, Mandiri, Kolaborasi / Gotong Royong';
  const model = data.modelPembelajaran || 'Problem Based Learning / Deep Learning';
  const sekolah = data.namaSekolah || 'Sekolah';
  const karakteristikSiswa = data.identifikasiPesertaDidik || 'Siswa aktif, rasa ingin tahu tinggi';

  // Activity type instruction
  let activityInstruction = 'Aktivitas campuran (eksplorasi individu lalu berbagi dengan teman sebangku/kelompok)';
  if (activityType === 'individu') {
    activityInstruction = 'Aktivitas mandiri peserta didik yang mengasah kemandirian berpikir';
  } else if (activityType === 'kelompok') {
    activityInstruction = 'Aktivitas kolaboratif kelompok kecil (2-4 siswa) dengan pembagian peran jelas';
  } else if (activityType === 'luar_kelas') {
    activityInstruction = 'Aktivitas pengamatan dan eksplorasi kontekstual di lingkungan sekitar sekolah/kelas';
  }

  // Difficulty level instruction
  let difficultyInstruction = `Sesuai tahap perkembangan kognitif siswa jenjang ${jenjang} (${kelas}, Fase ${fase})`;
  if (difficultyLevel === 'mudah') {
    difficultyInstruction = `Sederhana, memandu langkah demi langkah dengan ilustrasi petunjuk ramah anak pemula`;
  } else if (difficultyLevel === 'menantang_hots') {
    difficultyInstruction = `Menantang daya nalar kritis (HOTS: menganalisis, membandingkan, dan menyimpulkan secara kontekstual)`;
  }

  return `Bertindaklah sebagai Guru ${jenjang} yang kreatif, inspiratif, dan ahli dalam Kurikulum Merdeka Kemendikbudristek RI.
Buatkan Lembar Kerja Peserta Didik (LKPD) yang menarik, berorientasi Pembelajaran Mendalam (Deep Learning: Mindful, Meaningful, Joyful), dan siap cetak langsung digunakan di kelas.

[IDENTITAS & KONTEKS MODUL AJAR]
- Satuan Pendidikan: ${sekolah}
- Jenjang / Fase / Kelas: ${jenjang} / Fase ${fase} / ${kelas}
- Tema / Subtema: ${tema}
- Topik Kegiatan: ${topik}
- Materi Pembelajaran: ${materi}
- Tujuan Pembelajaran (TP): ${tujuan}
- Elemen Capaian Pembelajaran (CP): ${elemenCp}
- Dimensi Profil Pelajar Pancasila: ${dimensiP3}
- Pendekatan / Model Pembelajaran: ${model}
- Karakteristik Siswa: ${karakteristikSiswa}

[SPESIFIKASI KHUSUS LKPD]
- Format Aktivitas: ${activityInstruction}
- Jumlah Latihan Soal / Penugasan: ${questionCount} soal/tugas variatif
- Tingkat Kesulitan: ${difficultyInstruction}
${additionalFocus ? `- Fokus Tambahan Guru: ${additionalFocus}` : ''}

[STRUKTUR & FORMAT DOKUMEN LKPD]
Susun dokumen LKPD dengan bagian-bagian berikut secara rapi, berformat teratur dan siap cetak:
1. KOP LEMBAR KERJA PESERTA DIDIK (LKPD)
   - Judul Kegiatan yang Menarik & Menyenangkan
   - Identitas Siswa: Nama Peserta Didik / Kelompok, Kelas, Hari/Tanggal, Alokasi Waktu
2. INFOGRAFIS & PETA KONSEP SINGKAT
   - Sajikan 3-4 butir intisari visual berupa "Peta Alur Belajar" atau fakta menarik "Tahukah Kamu?" terkait ${topik} agar siswa lebih bersemangat.
3. TUJUAN KEGIATAN PEMBELAJARAN
   - Kalimat ramah anak tentang apa yang akan dicapai dan dipelajari
4. ALAT & BAHAN YANG DIPERLUKAN
   - Sebutkan alat dan bahan sederhana yang mudah didapat siswa/guru
5. PETUNJUK PENGERJAAN
   - Tuliskan 3-4 petunjuk pengerjaan yang singkat, jelas, dan memotivasi
6. STIMULUS KONTEKSTUAL (APERSEPSI)
   - Narasi pemantik singkat, cerita keseharian, atau deskripsi gambar yang membangkitkan rasa ingin tahu siswa
7. KEGIATAN EKSPLORASI UTAMA
   - Langkah kerja aktivitas yang membuat siswa aktif bergerak, mengamati, berdiskusi, atau berkarya
8. LEMBAR SOAL & PENUGASAN (Sebanyak ${questionCount} Soal/Tugas Bervariasi)
   - Berikan variasi: isian bernalar, menjodohkan konsep, menganalisis situasi, dan tugas ekspresi/kreasi
   - Sediakan ruang/garis bertitik tempat siswa menuliskan jawaban mereka
9. REFLEKSI SAYA (UNTUK SISWA)
   - Pilihan emotikon perasaan (senang, bingung, bersemangat) dan 1-2 pertanyaan refleksi singkat
10. KUNCI JAWABAN & RUBRIK PENILAIAN SINGKAT (PANDUAN GURU)
   - Kunci jawaban ringkas dan kriteria penskoran untuk memudahkan guru menilai

CATATAN:
Tuliskan langsung isi dokumen LKPD lengkap dalam Bahasa Indonesia baku yang komunikatif dan ramah anak. Gunakan penomoran dan pembagian bab (A., B., C., D., E., F., G., H.) yang jelas agar rapi. Jangan sertakan pengantar seperti "Berikut adalah LKPD...".`;
}

/**
 * Fallback generator when offline or Gemini API is not yet configured.
 * Generates an extensive, highly relevant LKPD directly from the module data.
 */
export function generateLocalFallbackLkpd(data: ModulAjarData): string {
  const jenjang = data.jenjang || 'SD';
  const kelas = data.kelas || 'Kelas 1';
  const tema = data.temaSubtema || 'Lingkungan Sekolahku';
  const topik = data.topikPembelajaran || 'Mengenal dan Menjaga Lingkungan';
  const materi = data.materiPembelajaran || 'Pengenalan lingkungan dan peran diri';
  const tujuan = data.tujuanPembelajaran || 'Peserta didik dapat memahami dan mempraktikkan konsep pembelajaran dengan baik';
  const sekolah = data.namaSekolah || 'SDN 3 Purwosari';

  return `========================================================================
LEMBAR KERJA PESERTA DIDIK (LKPD)
${sekolah.toUpperCase()}
========================================================================

A. IDENTITAS SISWA & KEGIATAN
Judul Kegiatan : Petualangan Menjelajah "${topik}"
Tema / Subtema : ${tema}
Mata Pelajaran : Pembelajaran Tematik Terpadu / Kurikulum Merdeka
Kelas / Fase   : ${kelas} / Fase ${data.fase || 'A'}
Nama Siswa     : ..............................................................
Nomor Absen    : ...........
Hari / Tanggal : ..............................................................
Alokasi Waktu  : 2 x 35 Menit

------------------------------------------------------------------------
B. INFOGRAFIS ALUR BELAJAR DEEP LEARNING (MINDFUL - MEANINGFUL - JOYFUL)
------------------------------------------------------------------------
★ ALUR EKSPLORASI SISWA HARI INI:
  [1] Amati & Sadari   : Cermati stimulus dan fenomena sekitar tentang "${materi}".
  [2] Jelajahi Konsep  : Diskusikan pemahaman bersama teman dengan bergotong royong.
  [3] Bernalar & Kreasi: Tuntaskan latihan berpikir kritis dan buat kreasi karyamu.
  [4] Refleksi & Aksi  : Ungkapkan perasaanmu dan terapkan nilai positif dalam keseharian.

------------------------------------------------------------------------
C. TUJUAN PEMBELAJARAN
------------------------------------------------------------------------
Melalui kegiatan aktif di LKPD ini, peserta didik dapat:
1. ${tujuan}
2. Mengidentifikasi konsep penting terkait ${materi}.
3. Menunjukkan sikap mandiri, bernalar kritis, dan bergotong royong dalam menyelesaikan tugas.

------------------------------------------------------------------------
D. ALAT DAN BAHAN
------------------------------------------------------------------------
1. Alat tulis (pensil, penghapus, dan penggaris)
2. Pensil warna atau krayon
3. Buku pendamping atau lembar kerja ini

------------------------------------------------------------------------
E. PETUNJUK PENGERJAAN
------------------------------------------------------------------------
1. Berdoalah sebelum mulai mengerjakan lembar kerja.
2. Tuliskan nama lengkap dan kelas pada kolom identitas di atas.
3. Bacalah setiap teks pemantik dan petunjuk soal dengan cermat.
4. Tanyakan kepada Guru apabila ada bagian yang belum kamu pahami.
5. Kerjakan dengan jujur, teliti, dan penuh kegembiraan!

------------------------------------------------------------------------
F. STIMULUS KONTEKSTUAL (BACALAH DENGAN TELITI)
------------------------------------------------------------------------
Halo sahabat hebat! Hari ini kita akan belajar hal yang sangat seru tentang ${topik}.
Di sekitar kita, ada banyak hal menarik yang berkaitan dengan materi ini.
Ketika kita mengamati dengan teliti, kita bisa menemukan contoh nyata dari ${materi}.
Mari kita lakukan eksplorasi bersama dan buktikan kemampuan terbaikmu!

------------------------------------------------------------------------
G. AKTIVITAS UTAMA & PENUGASAN SISWA
------------------------------------------------------------------------

TUGAS 1: Mengenal dan Mengamati (Pilihan Ganda Bernalar)
Berilah tanda silang (X) pada huruf A, B, atau C di depan jawaban yang paling tepat!

1. Berdasarkan pengamatanmu mengenai ${topik}, manakah pernyataan di bawah ini yang paling benar?
   A. Kita harus mempelajarinya dengan sungguh-sungguh dan menerapkannya setiap hari.
   B. Kita hanya perlu mengetahuinya tanpa mempraktikkannya.
   C. Hal tersebut tidak ada hubungannya dengan kehidupan kita sehari-hari.
   Jawaban Siswa: [ ...... ]

2. Sikap yang mencerminkan profil pelajar bergotong royong saat mengerjakan tugas ini adalah...
   A. Mengerjakan sendiri tanpa mau membantu teman yang kesulitan.
   B. Saling berdiskusi, bertukar pendapat dengan santun, dan saling menghargai.
   C. Menunggu teman lain menyelesaikan jawaban terlebih dahulu.
   Jawaban Siswa: [ ...... ]

------------------------------------------------------------------------
TUGAS 2: Menjodohkan Konsep (Tariklah Garis Penghubung)
Pasangkan pernyataan di Kolom Kiri dengan konsep yang tepat di Kolom Kanan!

[KOLOM KIRI: Ciri / Situasi]              [KOLOM KANAN: Konsep Materi]
(1) Pemahaman awal tentang materi   ---->   (A) Nilai Karakter Gotong Royong
(2) Sikap bekerjasama dengan rukun  ---->   (B) Pemahaman Konsep ${materi.slice(0, 20)}
(3) Tindakan menjaga kebaikan       ---->   (C) Penerapan dalam Kehidupan Sehari-hari

------------------------------------------------------------------------
TUGAS 3: Isian Singkat Bernalar Kritis
Isilah titik-titik di bawah ini dengan jawaban yang tepat!

3. Tuliskan 2 (dua) contoh nyata penerapan ${topik} yang pernah kamu jumpai atau lakukan di rumah atau sekolah!
   Jawaban:
   a. ............................................................................................
   b. ............................................................................................

4. Mengapa kita perlu memahami ${materi} dengan baik? Jelaskan pendapatmu secara singkat!
   Jawaban:
   ................................................................................................
   ................................................................................................

------------------------------------------------------------------------
TUGAS 4: Tantangan Kreasi & Ekspresi Siswa
5. Gambarkan atau tuliskan sebuah pesan positif sederhana yang mengajak teman-temanmu untuk menerapkan nilai-nilai pembelajaran hari ini!
   +--------------------------------------------------------------------+
   |                                                                    |
   |                                                                    |
   |                  [ KOTAK KREASI & GAMBAR SISWA ]                   |
   |                                                                    |
   |                                                                    |
   +--------------------------------------------------------------------+

------------------------------------------------------------------------
G. REFLEKSI DIRI SISWA
------------------------------------------------------------------------
Bagaimana perasaanmu setelah menyelesaikan kegiatan LKPD ini?
Lingkari emotikon yang paling menggambarkan perasaanmu:
[ 😊 SANGAT SENANG ]    [ 🤔 PERLU BANTUAN ]    [ 🤩 SEMANGAT BELAJAR ]

Hal baru apa yang paling kamu sukai pada kegiatan hari ini?
Tuliskan di sini: ................................................................

------------------------------------------------------------------------
H. KUNCI JAWABAN & RUBRIK PENILAIAN (PANDUAN GURU)
------------------------------------------------------------------------
KUNCI JAWABAN:
1. A (Pernyataan yang tepat tentang menerapkan ilmu)
2. B (Saling berdiskusi dan bertukar pendapat)
3. Pasangan: (1)-(B), (2)-(A), (3)-(C)
4. Kebijaksanaan guru berdasarkan penalaran siswa (Logis, relevan dengan materi)
5. Kreasi gambar/pesan positif siswa dinilai berdasarkan kesesuaian pesan dan kerapian

PEDOMAN PENSKORAN:
- Soal Pilihan Ganda (2 soal) : Skor maksimal 20 (masing-masing 10)
- Menjodohkan (3 pasang)      : Skor maksimal 30 (masing-masing 10)
- Isian Singkat (2 soal)      : Skor maksimal 30 (masing-masing 15)
- Tugas Kreasi (1 tugas)       : Skor maksimal 20
Nilai Akhir = (Total Skor yang Diperoleh / 100) x 100
Kategori:
• 86 - 100 : Sangat Baik (Tuntas Istimewa)
• 71 - 85  : Baik (Tuntas)
• 60 - 70  : Cukup (Perlu Pemantapan)
• < 60     : Perlu Bimbingan Tambahan`;
}
