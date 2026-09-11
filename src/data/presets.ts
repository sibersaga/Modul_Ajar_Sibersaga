import { ModulAjarData } from '../types';

export const PRESET_MODUL_AJAR: Record<string, ModulAjarData> = {
  'sd-fase-a-keluarga': {
    id: 'preset-sd-fase-a',
    judulModul: 'SD Fase A - Aku dan Keluargaku yang Hebat',
    updatedAt: new Date().toISOString(),
    namaSekolah: 'SDN 3 Purwosari',
    namaPenyusun: 'Guru Kelas 1',
    nip: '19850512 201001 2 015',
    namaKepalaSekolah: 'Budi Santoso, S.Pd., M.Pd.',
    nipKepalaSekolah: '19700101 199512 1 001',
    jenjang: 'SD',
    fase: 'A',
    kelas: 'Kelas 1',
    semester: 1,
    bulan: 'Agustus',
    mingguKe: 2,
    alokasiWaktu: '5 x 3 JP',
    jumlahAnak: '28',
    modelPembelajaran: 'Problem Based Learning (PBL) & Experiential Learning',
    temaSubtema: 'Aku dan Keluargaku / Peran Anggota Keluarga di Rumah',
    elemenCp: 'Pancasila & Bahasa Indonesia: Mengidentifikasi identitas diri, menceritakan silsilah keluarga inti, serta mengekspresikan kasih sayang antaranggota keluarga secara santun.',
    dimensiProfilLulusan: [
      'Keimanan dan Ketakwaan terhadap Tuhan YME',
      'Kewargaan / Kebinekaan Global',
      'Penalaran Kritis',
      'Kolaborasi / Gotong Royong',
      'Kemandirian',
      'Komunikasi'
    ],
    identifikasiPesertaDidik: 'Peserta didik berada pada tahap transisi PAUD ke SD. Sebagian besar antusias bercerita tentang aktivitas di rumah, memiliki gaya belajar kinestetik dan visual, serta sedang mengasah kemampuan motorik halus dan literasi awal.',
    materiPembelajaran: 'Mengenal anggota keluarga inti (ayah, ibu, kakak, adik), tugas dan peran masing-masing anggota di rumah, serta ungkapan terima kasih dan tolong.',
    tujuanPembelajaran: 'Peserta didik mampu mengenali peran masing-masing anggota keluarga, menceritakan kebiasaan baik di rumah dengan bahasa santun, dan membuat pohon keluarga sederhana dengan penuh percaya diri.',
    topikPembelajaran: 'Saling Membantu dan Menyayangi dalam Keluarga',
    desainPembelajaranLintasDisiplinIlmu: 'Pendidikan Pancasila (Aturan dalam keluarga), Bahasa Indonesia (Kosakata kekerabatan & bertutur), Seni Rupa (Menggambar dan menempel foto keluarga).',
    desainPembelajaranPraktikPedagogis: 'Menerapkan 3 pilar Deep Learning: Berkesadaran (Mindful) saat menyadari kasih sayang orang tua, Bermakna (Meaningful) dengan menghubungkan kegiatan nyata di rumah, dan Menggembirakan (Joyful) melalui permainan kartu peran dan bernyanyi bersama.',
    desainPembelajaranKemitraanPembelajaran: [
      'Guru kelas sebagai fasilitator dan motivator belajar aktif',
      'Orang tua di rumah mendampingi anak membawa foto keluarga dan berbagi cerita silsilah',
      'Teman sebaya dalam kelompok kecil saling bertukar cerita tentang kebiasaan di rumah'
    ],
    desainPembelajaranLingkunganPembelajaran: [
      'Ruang kelas ramah anak dengan sudut baca keluarga dan karpet lingkaran bercerita',
      'Papan pajangan hasil karya (Pohon Keluarga Kasih Sayang) di dinding kelas',
      'Area bermain peran sudut rumah tangga sederhana'
    ],
    desainPembelajaranPemanfaatanDigital: [
      'Video animasi lagu "Satu Satu Aku Sayang Ibu" & tayangan interaktif cerita keluarga',
      'Dokumentasi digital foto presentasi peserta didik untuk portofolio kelas',
      'Slide interaktif pengenalan peran keluarga dengan gambar kontekstual'
    ],
    rencanaPelaksanaanAwal: [
      'Guru menyapa dengan salam hangat, doa bersama, dan mengecek kehadiran secara ceria.',
      'Apersepsi dan menyanyikan lagu "Satu-Satu Aku Sayang Ibu" bersama-sama dengan gerakan tubuh ceria.',
      'Pertanyaan Pemantik: "Siapa saja yang tinggal bersama kalian di rumah?", "Siapa yang tadi pagi membantu ibu merapikan tempat tidur?"'
    ],
    rencanaPelaksanaanInti: 'Pembelajaran inti dilaksanakan dengan pendekatan mendalam (Deep Learning) melalui 3 tahap: Memahami peran keluarga (Hari 1-2), Mengaplikasikan pemahaman lewat kreasi pohon keluarga dan bermain peran (Hari 3-4), dan Merefleksikan rasa syukur serta komitmen membantu di rumah (Hari 5).',
    kegiatanHarian: [
      {
        hari: 1,
        tahap: 'MEMAHAMI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Menyimak Cerita Bergambar "Keluarga Ceria"',
            prinsipDeepLearning: 'Berkesadaran (Mindful Learning)',
            sintaksModel: 'Tahap 1: Orientasi peserta didik pada masalah kontekstual',
            dimensi: 'Penalaran Kritis & Komunikasi',
            alatBahan: 'Buku cerita bergambar besar / Proyektor, kartu gambar ayah, ibu, anak',
            deskripsi: 'Guru membacakan dongeng inspiratif mengenai sebuah keluarga yang saling mendukung. Anak diajak menyimak dan menyebutkan nama-nama anggota keluarga.',
            langkah: [
              'Anak duduk melingkar di karpet cerita',
              'Menjawab pertanyaan interaktif tentang tokoh cerita',
              'Menyebutkan anggota keluarga masing-masing'
            ]
          },
          {
            jp: 2,
            judul: 'Mencocokkan Kartu Peran Keluarga',
            prinsipDeepLearning: 'Bermakna (Meaningful Learning)',
            sintaksModel: 'Tahap 2: Mengorganisasikan peserta didik untuk belajar kelompok',
            dimensi: 'Kolaborasi & Kemandirian',
            alatBahan: 'Kartu aktivitas (memasak, bekerja, belajar, mencuci piring)',
            deskripsi: 'Permainan memasangkan gambar peran dengan sosok anggota keluarga dalam kelompok kecil.',
            langkah: [
              'Membagi anak ke dalam kelompok 4 anak',
              'Memasangkan kartu tugas dengan sosok yang melaksanakannya',
              'Mendiskusikan bahwa semua pekerjaan rumah tangga dapat dikerjakan bersama'
            ]
          },
          {
            jp: 3,
            judul: 'Tepuk Keluarga Bahagia',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 2: Aktivitas ritmis & penguatan konsep peran keluarga',
            dimensi: 'Kesehatan & Komunikasi',
            alatBahan: 'Iringan tepuk tangan dan lagu riang',
            deskripsi: 'Aktivitas motorik ritmis berupa tepukan bertema keluarga untuk menguatkan daya ingat nama-nama anggota keluarga.',
            langkah: [
              'Memperagakan gerakan tepuk tangan berpola',
              'Menyebutkan panggilan anggota keluarga dengan artikulasi jelas',
              'Berbagi senyum dan salam antarteman'
            ]
          }
        ]
      },
      {
        hari: 2,
        tahap: 'MEMAHAMI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Eksplorasi Foto Keluarga & Bertutur',
            prinsipDeepLearning: 'Berkesadaran & Bermakna',
            sintaksModel: 'Tahap 3: Membimbing eksplorasi dan penyelidikan mandiri',
            dimensi: 'Komunikasi & Keimanan',
            alatBahan: 'Foto keluarga yang dibawa dari rumah, bingkai karton',
            deskripsi: 'Setiap anak menunjukkan foto keluarganya dan memperkenalkan siapa saja yang ada di dalam foto dengan kalimat sederhana.',
            langkah: [
              'Mengenalkan nama panggilan ayah, ibu, dan saudara',
              'Menceritakan hal yang paling disukai saat berkumpul bersama',
              'Menyimak presentasi teman dengan rasa menghormati'
            ]
          },
          {
            jp: 2,
            judul: 'Mengenal Kosakata Kekerabatan & Menulis Huruf Awal',
            prinsipDeepLearning: 'Bermakna (Meaningful Learning)',
            sintaksModel: 'Tahap 3: Penyelidikan konsep kosakata & literasi awal',
            dimensi: 'Penalaran Kritis & Kemandirian',
            alatBahan: 'Papan tulis kecil/kertas LKPD, spidol warna',
            deskripsi: 'Mengenal huruf vokal dan konsonan awal pada kata Ayah (A), Ibu (I), Kakak (K), Adik (A).',
            langkah: [
              'Menebalkan huruf awal nama panggilan keluarga',
              'Melafalkan bunyi huruf secara fonik',
              'Menghubungkan gambar anggota keluarga dengan kata yang tepat'
            ]
          },
          {
            jp: 3,
            judul: 'Permainan Gerak & Tebak Peran',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 3: Simulasi pemahaman peran melalui gerak aktif',
            dimensi: 'Kreativitas & Kolaborasi',
            alatBahan: 'Properti mainan (sapu mini, buku, kacamata)',
            deskripsi: 'Salah satu anak memperagakan gerakan rutinitas keluarga (misal: menyapu, menggendong adik) lalu teman-temannya menebak.',
            langkah: [
              'Anak sukarela maju mempraktikkan gerakan pantomim',
              'Teman kelas menebak peran dengan sopan',
              'Memberikan tepuk apresiasi untuk keberanian tampil'
            ]
          }
        ]
      },
      {
        hari: 3,
        tahap: 'MENGAPLIKASI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Membuat Kreasi Pohon Keluarga (Bagian 1: Batang & Dahan)',
            prinsipDeepLearning: 'Bermakna (Meaningful Learning)',
            sintaksModel: 'Tahap 4: Mengembangkan perencanaan produk karya kelompok',
            dimensi: 'Kreativitas & Kemandirian',
            alatBahan: 'Kertas karton manila coklat dan hijau, gunting aman anak, lem kertas',
            deskripsi: 'Anak membuat pola pohon silsilah keluarga menggunakan jiplakan telapak tangan atau pola dahan.',
            langkah: [
              'Menjiplak bentuk telapak tangan sebagai cabang pohon',
              'Menggunting sesuai garis dengan pengawasan guru',
              'Menempelkan batang pohon pada kertas dasar'
            ]
          },
          {
            jp: 2,
            judul: 'Menempelkan Daun Foto & Nama Anggota Keluarga',
            prinsipDeepLearning: 'Bermakna & Menggembirakan',
            sintaksModel: 'Tahap 4: Mengembangkan dan membuat karya pohon keluarga',
            dimensi: 'Kemandirian & Kerapian',
            alatBahan: 'Foto keluarga mini / gambar kartun keluarga, stiker nama',
            deskripsi: 'Anak menempatkan foto ayah dan ibu di posisi atas, serta foto diri dan saudara di dahan berikutnya.',
            langkah: [
              'Mengatur posisi foto secara berurutan',
              'Menuliskan nama panggilan di bawah foto',
              'Menghias daun dengan krayon warna-warni'
            ]
          },
          {
            jp: 3,
            judul: 'Pameran Mini "Galeri Keluargaku"',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 4: Menyajikan hasil karya (Mini Gallery Walk)',
            dimensi: 'Kewargaan & Komunikasi',
            alatBahan: 'Jepitan kayu, tali gantungan karya di dinding kelas',
            deskripsi: 'Anak menggantung karyanya di tali pajangan dan melakukan gallery walk keliling mengapresiasi hasil karya teman.',
            langkah: [
              'Menggantung hasil karya di sudut pameran',
              'Berkeliling melihat pohon keluarga milik teman',
              'Memberikan stiker bintang senyum pada karya teman'
            ]
          }
        ]
      },
      {
        hari: 4,
        tahap: 'MENGAPLIKASI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Simulasi Bermain Peran: Gotong Royong di Rumah',
            prinsipDeepLearning: 'Bermakna & Menggembirakan',
            sintaksModel: 'Tahap 4: Simulasi kontekstual pemecahan masalah kerja sama',
            dimensi: 'Kolaborasi & Gotong Royong',
            alatBahan: 'Peralatan rumah tangga mainan (piring plastik, kemoceng, taplak meja)',
            deskripsi: 'Anak memerankan skenario kerja bakti membersihkan ruang tamu dan menyiapkan meja makan bersama keluarga.',
            langkah: [
              'Membagi peran ayah, ibu, dan anak-anak',
              'Mempraktikkan kata ajaib: "tolong", "maaf", dan "terima kasih"',
              'Merapikan kembali perlengkapan mainan ke tempatnya'
            ]
          },
          {
            jp: 2,
            judul: 'Menyusun Kalimat Sederhana Kasih Sayang',
            prinsipDeepLearning: 'Bermakna (Meaningful Learning)',
            sintaksModel: 'Tahap 4: Mengembangkan ekspresi komunikasi kasih sayang',
            dimensi: 'Penalaran Kritis & Komunikasi',
            alatBahan: 'Kartu kata bergambar (Aku, Sayang, Ayah, Ibu, Adik)',
            deskripsi: 'Anak menyusun urutan kartu kata menjadi kalimat yang bermakna kasih sayang keluarga.',
            langkah: [
              'Mengambil kartu kata bergambar',
              'Menyusun urutan kartu di meja kerja',
              'Membaca kalimat yang telah tersusun bersama pasangan teman'
            ]
          },
          {
            jp: 3,
            judul: 'Membuat Kartu Ucapan Terima Kasih untuk Orang Tua',
            prinsipDeepLearning: 'Berkesadaran & Bermakna',
            sintaksModel: 'Tahap 4: Mendesain produk ungkapan rasa syukur untuk keluarga',
            dimensi: 'Kreativitas & Keimanan',
            alatBahan: 'Kertas origami lipat, spidol glitter, pita kecil',
            deskripsi: 'Anak menggambar tanda hati dan menulis ucapan terima kasih sederhana untuk diserahkan kepada orang tua saat pulang.',
            langkah: [
              'Melipat kertas origami menjadi kartu ucapan',
              'Menggambar dan mewarnai ungkapan kasih sayang',
              'Menyimpan kartu di tas untuk diberikan kepada ayah/ibu di rumah'
            ]
          }
        ]
      },
      {
        hari: 5,
        tahap: 'MEREFLEKSI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Lingkaran Refleksi (Circle Time): Apa yang Kupelajari Pekan Ini?',
            prinsipDeepLearning: 'Berkesadaran (Mindful Learning)',
            sintaksModel: 'Tahap 5: Menganalisis dan mengevaluasi proses pemecahan masalah',
            dimensi: 'Penalaran Kritis & Kemandirian',
            alatBahan: 'Bola senyum (talking ball), papan emosi emoji',
            deskripsi: 'Anak bergiliran memegang bola dan menceritakan kegiatan mana yang paling berkesan serta perasaan mereka selama belajar satu pekan.',
            langkah: [
              'Duduk dalam lingkaran berkesadaran (mindful sitting)',
              'Menceritakan satu hal baik yang akan dilakukan untuk membantu orang tua di rumah',
              'Menempelkan stiker perasaan pada grafik emoji kelas'
            ]
          },
          {
            jp: 2,
            judul: 'Janji Anak Hebat: Membantu Keluarga',
            prinsipDeepLearning: 'Bermakna & Berkesadaran',
            sintaksModel: 'Tahap 5: Evaluasi diri dan komitmen aksi nyata di rumah',
            dimensi: 'Kemandirian & Kewargaan',
            alatBahan: 'Lembar komitmen bergambar (merapikan kasur, menaruh sepatu di rak)',
            deskripsi: 'Anak mencentang kebiasaan mandiri yang siap mereka lakukan di rumah secara rutin.',
            langkah: [
              'Memilih 2 kebiasaan mandiri yang ingin ditingkatkan',
              'Menempelkan cap jempol komitmen',
              'Membacakan janji bersama guru dan teman'
            ]
          },
          {
            jp: 3,
            judul: 'Apresiasi & Doa Syukur Keluarga',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 5: Selebrasi capaian belajar, penguatan, dan refleksi spiritual',
            dimensi: 'Keimanan dan Ketakwaan',
            alatBahan: 'Buku rekap capaian mingguan, sertifikat bintang pembelajar',
            deskripsi: 'Guru memberikan penguatan positif atas perkembangan kemandirian anak serta memanjatkan doa syukur atas nikmat keluarga.',
            langkah: [
              'Guru memberikan pin "Anak Hebat Sayang Keluarga"',
              'Berdoa bersama untuk keselamatan dan kebahagiaan seluruh keluarga di rumah',
              'Persiapan pulang dengan salam santun dan ceria'
            ]
          }
        ]
      }
    ],
    rencanaPelaksanaanPenutup: [
      'Guru dan peserta didik melakukan refleksi bersama atas seluruh proses belajar hari ini.',
      'Menyimpulkan pembelajaran dengan mengulang pesan kunci: saling menghormati dan membantu di rumah.',
      'Memberikan apresiasi dan pujian atas keterlibatan aktif semua anak.',
      'Berdoa bersama dipimpin oleh salah satu siswa yang bergiliran, dan salam perpisahan yang hangat.'
    ],
    asesmenPembelajaranAwal: 'Tanya jawab informal saat apersepsi mengenai anggota keluarga di rumah dan observasi kesiapan berbicara di depan teman.',
    asesmenPembelajaranProses: 'Lembar observasi ceklis keterlibatan aktif, kemampuan bekerja sama dalam kelompok, penggunaan kata santun (tolong/terima kasih), serta motorik saat membuat pohon keluarga.',
    asesmenPembelajaranAkhir: 'Rubrik penilaian unjuk kerja produk "Pohon Keluarga" dan kemampuan mempresentasikan silsilah keluarga inti dengan percaya diri.',
    lembarKerjaSiswa: 'LKPD 1: Hubungkan garis antara gambar anggota keluarga dengan sebutannya. LKPD 2: Tempelkan foto keluargamu pada bingkai pohon cinta.',
    rubrikPenilaian: 'Kriteria Penilaian (Skala 1-4: Perlu Bimbingan, Cukup, Baik, Sangat Baik): 1. Pengenalan peran keluarga, 2. Partisipasi dan kolaborasi kelompok, 3. Kerapian dan kreativitas produk pohon keluarga, 4. Sikap santun dan percaya diri dalam bertutur.'
  },
  'paud-fase-fondasi-diriku': {
    id: 'preset-paud-fase-fondasi',
    judulModul: 'PAUD Fase Fondasi - Aku Mengenal Diriku dan Teman Baruku',
    updatedAt: new Date().toISOString(),
    namaSekolah: 'TK / PAUD Pembina Harapan',
    namaPenyusun: 'Guru Sentra / Kelas A',
    nip: '',
    namaKepalaSekolah: 'Siti Aminah, S.Pd.AUD.',
    nipKepalaSekolah: '19750817 200501 2 003',
    jenjang: 'PAUD',
    fase: 'Fondasi',
    kelas: 'Kelompok A (4-5 tahun)',
    semester: 1,
    bulan: 'Juli',
    mingguKe: 1,
    alokasiWaktu: '5 x 3 JP',
    jumlahAnak: '15',
    modelPembelajaran: 'Sentra & Area Bermain Eksploratif (Deep Learning)',
    temaSubtema: 'Diriku / Identitas dan Anggota Tubuhku',
    elemenCp: 'Nilai Agama & Budi Pekerti, Jati Diri, serta Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni (STEAM).',
    dimensiProfilLulusan: [
      'Keimanan dan Ketakwaan terhadap Tuhan YME',
      'Kemandirian',
      'Kreativitas',
      'Kolaborasi',
      'Kesehatan',
      'Komunikasi'
    ],
    identifikasiPesertaDidik: 'Anak baru pertama kali masuk lingkungan sekolah formal. Sebagian masih membutuhkan pendampingan adaptasi, aktif bergerak, senang mengeksplorasi sensorik tactile, dan memerlukan penguatan percaya diri untuk bersosialisasi.',
    materiPembelajaran: 'Mengenal nama diri, ciri fisik (rambut, jenis kelamin), bagian tubuh utama (kepala, tangan, kaki), dan cara merawat kebersihan diri.',
    tujuanPembelajaran: 'Anak mampu menyebutkan nama diri dan jenis kelaminnya dengan berani, mengenali fungsi anggota tubuh ciptaan Tuhan, serta mau bermain berdampingan dengan teman baru.',
    topikPembelajaran: 'Aku Ciptaan Tuhan yang Istimewa',
    desainPembelajaranLintasDisiplinIlmu: 'Pengenalan Diri, Sains Sensorik Sederhana, Seni Kolase Bahan Lepasan (Loose Parts), dan Musik Gerak.',
    desainPembelajaranPraktikPedagogis: 'Pembelajaran Bermakna dan Menggembirakan melalui pendekatan bermain sensori, lagu anak interaktif, dan cermin eksplorasi diri.',
    desainPembelajaranKemitraanPembelajaran: [
      'Guru sentra sebagai pamong pendamping yang ramah dan penuh empati',
      'Orang tua mendukung masa orientasi transisi anak dengan senyuman dan ketepatan waktu penjemputan'
    ],
    desainPembelajaranLingkunganPembelajaran: [
      'Sentra bahan alam dan loose parts',
      'Cermin besar eksplorasi ekspresi wajah dan tubuh',
      'Karpet cerita lembut dan area bermain balok aman'
    ],
    desainPembelajaranPemanfaatanDigital: [
      'Lagu audio anak "Kepala Pundak Lutut Kaki" & video animasi pengenalan diri',
      'Dokumentasi foto ekspresi hari pertama sekolah untuk portofolio digital orang tua'
    ],
    rencanaPelaksanaanAwal: [
      'Penyambutan ramah di pintu kelas dengan senyum, sapa, dan salam.',
      'Bermain lingkaran ceria dan berdoa sebelum kegiatan.',
      'Tepuk Anak Saleh dan menyanyikan lagu "Dua Mata Saya".'
    ],
    rencanaPelaksanaanInti: 'Penerapan 3 pilar: Memahami identitas diri (Hari 1-2), Mengaplikasikan lewat kreasi cetak telapak tangan & cermin ajaib (Hari 3-4), Merefleksikan perasaan gembira bersekolah (Hari 5).',
    kegiatanHarian: [
      {
        hari: 1,
        tahap: 'MEMAHAMI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Permainan Cermin Ajaib',
            prinsipDeepLearning: 'Berkesadaran (Mindful Learning)',
            sintaksModel: 'Tahap 1: Pijakan lingkungan & orientasi cermin',
            dimensi: 'Kemandirian & Komunikasi',
            alatBahan: 'Cermin besar, bingkai hias',
            deskripsi: 'Anak berdiri di depan cermin, mengamati wajah dan rambutnya, lalu menyebutkan namanya.',
            langkah: ['Melihat bayangan diri di cermin', 'Menyebutkan nama dan jenis kelamin', 'Tersenyum gembira melihat bayangan diri']
          },
          {
            jp: 2,
            judul: 'Bernyanyi & Gerak "Kepala Pundak Lutut Kaki"',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 2: Pijakan pengalaman sebelum main kinestetik',
            dimensi: 'Kesehatan & Motorik',
            alatBahan: 'Musik riang, ruang terbuka',
            deskripsi: 'Aktivitas motorik kasar melatih koordinasi indra dan gerak tubuh mengikuti tempo lagu.',
            langkah: ['Mengikuti instruksi guru memegang bagian tubuh', 'Menyesuaikan kecepatan tempo musik', 'Tertawa ceria bersama teman']
          },
          {
            jp: 3,
            judul: 'Mencari Jejak Telapak Tangan',
            prinsipDeepLearning: 'Berkesadaran (Mindful Learning)',
            sintaksModel: 'Tahap 4: Pijakan setelah main / Recalling sensori',
            dimensi: 'Penalaran Kritis',
            alatBahan: 'Kertas cetakan telapak tangan warna-warni',
            deskripsi: 'Anak mencari pola ukuran tangan yang sesuai dengan tangannya di karpet.',
            langkah: ['Mencocokkan telapak tangan dengan gambar', 'Menghitung 5 jari tangan']
          }
        ]
      },
      {
        hari: 2,
        tahap: 'MEMAHAMI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Finger Painting Cap Telapak Tangan',
            prinsipDeepLearning: 'Bermakna & Menggembirakan',
            sintaksModel: 'Tahap 3: Pijakan saat main di Sentra Bahan Alam & Sensori',
            dimensi: 'Kreativitas & Sensorik',
            alatBahan: 'Pewarna makanan aman (food grade), kertas gambar tebal',
            deskripsi: 'Mencap telapak tangan dengan aneka warna untuk membentuk bunga atau matahari identitas.',
            langkah: ['Merasakan tekstur cat pasta', 'Mencap di atas kertas', 'Mencuci tangan bersih secara mandiri']
          },
          {
            jp: 2,
            judul: 'Tebak Suara Temanku',
            prinsipDeepLearning: 'Berkesadaran (Mindful Learning)',
            sintaksModel: 'Tahap 3: Pijakan saat main stimulasi pendengaran & fokus',
            dimensi: 'Komunikasi & Kolaborasi',
            alatBahan: 'Kain penutup mata lembut',
            deskripsi: 'Satu anak menebak nama teman yang memanggilnya dari belakang.',
            langkah: ['Mendengarkan panggilan teman', 'Menebak nama pemilik suara']
          },
          {
            jp: 3,
            judul: 'Senam Irama Pagi',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 4: Pijakan setelah main / Recalling gerak tubuh',
            dimensi: 'Kesehatan',
            alatBahan: 'Iringan drum kecil',
            deskripsi: 'Gerak bebas menggerakkan tangan, pinggang, dan kaki melatih motorik kasar.',
            langkah: ['Mengikuti ketukan ritme', 'Melompat perlahan dan meregangkan tangan']
          }
        ]
      },
      {
        hari: 3,
        tahap: 'MENGAPLIKASI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Menyusun Wajah dari Loose Parts (Bahan Lepasan)',
            prinsipDeepLearning: 'Bermakna & Menggembirakan',
            sintaksModel: 'Tahap 3: Pijakan saat main di Sentra Seni & Rancang Bangun',
            dimensi: 'Kreativitas & Kognitif',
            alatBahan: 'Kancing besar, tutup botol aneka warna, ranting, daun kering, piring kertas',
            deskripsi: 'Anak membuat wajah tersenyum menggunakan benda-benda sekitar di piring kertas.',
            langkah: ['Memilih benda untuk mata, hidung, dan mulut', 'Menata di piring kertas', 'Menceritakan ekspresi wajah yang dibuat']
          },
          {
            jp: 2,
            judul: 'Bermain Peran Bersalaman & Mengenal Teman',
            prinsipDeepLearning: 'Bermakna (Meaningful Learning)',
            sintaksModel: 'Tahap 3: Pijakan saat main di Sentra Main Peran Sosial',
            dimensi: 'Kolaborasi & Komunikasi',
            alatBahan: 'Boneka tangan',
            deskripsi: 'Praktik bersalaman dan mengucapkan "Halo, namaku..." kepada teman di sebelahnya.',
            langkah: ['Menyentuh telapak tangan teman dengan sopan', 'Menyebutkan nama diri dan tersenyum']
          },
          {
            jp: 3,
            judul: 'Meronce Kalung Nama',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 4: Pijakan setelah main / Recalling & apresiasi produk',
            dimensi: 'Kemandirian & Motorik Halus',
            alatBahan: 'Sedotan warna potong pendek, benang wol tumpul',
            deskripsi: 'Meronce sedotan warna menjadi kalung cantik dengan gantungan foto diri.',
            langkah: ['Memasukkan benang ke lubang sedotan', 'Memakai kalung kreasi sendiri']
          }
        ]
      },
      {
        hari: 4,
        tahap: 'MENGAPLIKASI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Menjiplak Bentuk Tubuh di Kertas Gulung Besar',
            prinsipDeepLearning: 'Bermakna & Menggembirakan',
            sintaksModel: 'Tahap 3: Pijakan saat main eksplorasi ukuran diri & kolaborasi',
            dimensi: 'Kolaborasi & Kreativitas',
            alatBahan: 'Kertas payung besar, krayon tebal',
            deskripsi: 'Anak berbaring di atas kertas besar, guru atau teman menggambar siluet luar tubuhnya.',
            langkah: ['Berbaring tenang di atas kertas', 'Melihat siluet tubuh diri yang terbentuk', 'Mewarnai baju siluet bersama']
          },
          {
            jp: 2,
            judul: 'Permainan Oper Bola Nama',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 3: Pijakan saat main pengenalan nama & ketangkasan',
            dimensi: 'Komunikasi & Kolaborasi',
            alatBahan: 'Bola spons lembut',
            deskripsi: 'Menggelindingkan bola ke teman yang dipanggil namanya.',
            langkah: ['Menerima bola dengan kedua tangan', 'Menggelindingkan bola ke arah teman']
          },
          {
            jp: 3,
            judul: 'Merapikan Mainan Bersama (Clean Up Time)',
            prinsipDeepLearning: 'Berkesadaran (Mindful Learning)',
            sintaksModel: 'Tahap 4: Pijakan setelah main / Pembiasaan tanggung jawab',
            dimensi: 'Kemandirian & Gotong Royong',
            alatBahan: 'Keranjang mainan berlabel warna',
            deskripsi: 'Mengembalikan balok dan krayon ke wadah yang sesuai sambil bernyanyi lagu beres-beres.',
            langkah: ['Memasukkan benda ke keranjang', 'Mengecek lantai kelas tetap bersih']
          }
        ]
      },
      {
        hari: 5,
        tahap: 'MEREFLEKSI',
        kegiatan: [
          {
            jp: 1,
            judul: 'Pohon Senyum: Berbagi Perasaan Belajar',
            prinsipDeepLearning: 'Berkesadaran (Mindful Learning)',
            sintaksModel: 'Tahap 4: Pijakan setelah main / Recalling emosi & refleksi diri',
            dimensi: 'Penalaran Kritis & Komunikasi',
            alatBahan: 'Papan bergambar pohon, stiker emotikon senang',
            deskripsi: 'Anak menempel stiker senyum pada pohon dan menceritakan mainan favoritnya.',
            langkah: ['Memilih stiker ekspresi', 'Menempelkan di pohon senyum']
          },
          {
            jp: 2,
            judul: 'Makan Bersama & Berbagi Makanan Sehat',
            prinsipDeepLearning: 'Bermakna (Meaningful Learning)',
            sintaksModel: 'Tahap 4: Pembiasaan adab berkesadaran saat makan bersama',
            dimensi: 'Kesehatan & Adab Beragama',
            alatBahan: 'Kotak bekal anak, serbet',
            deskripsi: 'Praktik mencuci tangan sebelum makan, berdoa bersama, dan makan dengan tertib.',
            langkah: ['Mencuci tangan dengan sabun', 'Berdoa sebelum makan', 'Merapikan kotak bekal']
          },
          {
            jp: 3,
            judul: 'Pelukan Persahabatan & Doa Pulang',
            prinsipDeepLearning: 'Menggembirakan (Joyful Learning)',
            sintaksModel: 'Tahap 4: Refleksi akhir pekan, selebrasi, dan doa syukur',
            dimensi: 'Keimanan & Kolaborasi',
            alatBahan: 'Lagu perpisahan ceria',
            deskripsi: 'Saling melambaikan tangan kepada teman dan guru, berdoa syukur, lalu bersiap dijemput.',
            langkah: ['Berdoa bersama', 'Bersalaman dengan guru secara tertib']
          }
        ]
      }
    ],
    rencanaPelaksanaanPenutup: [
      'Mendiskusikan pengalaman bermain sepanjang hari.',
      'Memberikan stiker bintang apresiasi keberanian dan kemandirian anak.',
      'Berdoa bersama dan pesan moral menjaga kebersihan di rumah.'
    ],
    asesmenPembelajaranAwal: 'Catatan anekdot observasi awal saat anak tiba di sekolah dan respon saat disapa oleh guru.',
    asesmenPembelajaranProses: 'Ceklis capaian perkembangan motorik kasar, kemampuan bersosialisasi, dan kebersihan diri.',
    asesmenPembelajaranAkhir: 'Foto berseri portofolio karya kreasi loose parts dan catatan anekdot kemandirian anak.',
    lembarKerjaSiswa: 'Mewarnai gambar anak laki-laki dan perempuan sesuai diri sendiri.',
    rubrikPenilaian: 'Penilaian Ceklis (Muncul / Belum Muncul): 1. Berani menyebutkan nama diri, 2. Mampu mencuci tangan mandiri, 3. Mau berbagi mainan dengan teman.'
  }
};
