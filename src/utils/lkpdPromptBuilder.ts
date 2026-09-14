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
- Tipe Soal: HANYA ISIAN SINGKAT dan URAIAN saja (TIDAK menggunakan pilihan ganda atau format rumit agar tata letak rapi dan tertib)
- Jumlah Latihan Soal: ${questionCount} butir soal terstruktur (terbagi atas Isian Singkat dan Uraian)
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
7. F. AKTIVITAS UTAMA & LEMBAR KERJA (SOAL ISIAN SINGKAT & URAIAN)
   - PENTING: Bagian ini HARUS HANYA terdiri dari 2 kategori soal berikut:
     * BAGIAN I: SOAL ISIAN SINGKAT (Pertanyaan terarah bernalar kritis dengan garis titik-titik jawaban rapi)
     * BAGIAN II: SOAL URAIAN DAN PENALARAN (Pertanyaan analisis pemahaman kontekstual mendalam dengan ruang garis bertitik yang lapang)
   - DILARANG membuat soal pilihan ganda (A, B, C, D), menjodohkan berpanah, atau format ASCII lainnya agar tata letak tidak berantakan.
   - Tata letak penulisan: Setiap butir soal disusun dengan kalimat tertib, memperhatikan rata kiri-kanan proporsional, margin dan jarak antarsoal yang lega, serta garis titik-titik tempat menulis jawaban (....................................................................................................).
8. REFLEKSI SAYA (UNTUK SISWA)
   - Pilihan emotikon perasaan (senang, bingung, bersemangat) dan 1-2 pertanyaan refleksi singkat
9. KUNCI JAWABAN & RUBRIK PENILAIAN SINGKAT (PANDUAN GURU)
   - Kunci jawaban ringkas dan pedoman penskoran untuk soal isian dan uraian untuk memudahkan guru menilai

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
F. AKTIVITAS UTAMA & LEMBAR KERJA (SOAL ISIAN SINGKAT & URAIAN)
------------------------------------------------------------------------

BAGIAN I: SOAL ISIAN SINGKAT
Petunjuk Pengerjaan: Isilah titik-titik pada kalimat di bawah ini dengan jawaban yang singkat, tepat, dan benar!

1. Berdasarkan apa yang telah kita pelajari mengenai ${topik}, salah satu hal penting yang perlu kita biasakan dan terapkan dalam aktivitas sehari-hari adalah ...
   Jawaban:
   ....................................................................................................

2. Ketika kita memahami dan mempraktikkan materi ${materi} dengan sungguh-sungguh, manfaat utama yang dirasakan oleh diri kita dan lingkungan sekitar adalah ...
   Jawaban:
   ....................................................................................................

3. Sikap Profil Pelajar Pancasila yang paling kita tunjukkan saat bekerjasama dan saling membantu menyelesaikan tugas belajar bersama teman adalah sikap ...
   Jawaban:
   ....................................................................................................

------------------------------------------------------------------------
BAGIAN II: SOAL URAIAN DAN PENALARAN
Petunjuk Pengerjaan: Jawablah pertanyaan-pertanyaan berikut dengan kalimat penjelasanmu sendiri secara runtut, rapi, dan jelas!

4. Mengapa kita perlu memahami materi ${materi} dengan baik? Jelaskan alasanmu secara lengkap dan berikan 2 (dua) contoh nyata yang pernah kamu temui di lingkungan sekolah atau rumah!
   Jawaban / Uraian:
   ....................................................................................................
   ....................................................................................................
   ....................................................................................................
   ....................................................................................................

5. Bagaimana tindakan atau langkah nyata yang akan kamu lakukan apabila melihat seorang teman mengalami kesulitan dalam memahami materi ${topik}? Uraikan pendapat dan sikap terbaikmu!
   Jawaban / Uraian:
   ....................................................................................................
   ....................................................................................................
   ....................................................................................................
   ....................................................................................................

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
1. Menerapkan nilai kebaikan dan pemahaman materi secara konsisten dalam kehidupan sehari-hari.
2. Lingkungan menjadi lebih tertib, harmonis, serta meningkatkan pemahaman dan keterampilan diri.
3. Gotong Royong / Kolaborasi dan Mandiri.
4. Rubrik Penilaian Uraian: Jawaban memuat alasan logis pentingnya materi serta 2 contoh konkret yang relevan dengan kehidupan siswa.
5. Rubrik Penilaian Uraian: Menunjukkan empati, kemauan membantu teman dengan santun tanpa merendahkan, dan mencerminkan akhlak mulia.

PEDOMAN PENSKORAN:
- Soal Isian Singkat (3 butir) : Masing-masing skor maksimal 10 (Total 30 poin)
- Soal Uraian (2 butir)        : Masing-masing skor maksimal 35 (Total 70 poin)
Total Skor Maksimal = 100
Nilai Akhir = (Total Skor yang Diperoleh / 100) x 100

Kategori Capaian:
• 86 - 100 : Sangat Baik (Tuntas Istimewa)
• 71 - 85  : Baik (Tuntas Memuaskan)
• 60 - 70  : Cukup (Perlu Pemantapan)
• < 60     : Perlu Bimbingan Tambahan`;
}
