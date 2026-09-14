export type JenjangPendidikan = 'PAUD' | 'SD' | 'SMP' | 'SMA';
export type FaseKurikulum = 'Fondasi' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type PaperSize = 'A4' | 'F4' | 'CUSTOM';

export interface PaperConfig {
  size: PaperSize;
  customWidthMm?: number;
  customHeightMm?: number;
  orientation?: 'portrait' | 'landscape';
}

export interface DetailKegiatanItem {
  jp: number;
  judul: string;
  prinsipDeepLearning?: string;
  sintaksModel?: string;
  dimensi?: string;
  alatBahan?: string;
  deskripsi: string;
  langkah?: string[];
}

export interface HariKegiatan {
  hari: number;
  tahap: 'MEMAHAMI' | 'MENGAPLIKASI' | 'MEREFLEKSI';
  kegiatan: DetailKegiatanItem[];
}

export interface ModulAjarData {
  id?: string;
  judulModul?: string;
  updatedAt?: string;

  // 1. Credentials & Identitas Dokumen
  namaSekolah: string;
  namaPenyusun: string;
  nip: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  jenjang: JenjangPendidikan;
  fase: FaseKurikulum;
  kelas: string;
  semester: number;
  bulan: string;
  mingguKe: number;
  alokasiWaktu: string;
  jumlahAnak: string;
  modelPembelajaran: string;

  // 2. Tema, Capaian & Karakteristik
  temaSubtema: string;
  elemenCp: string;
  dimensiProfilLulusan: string[];
  identifikasiPesertaDidik: string;
  materiPembelajaran: string;

  // 3. Desain Pembelajaran
  tujuanPembelajaran: string;
  topikPembelajaran: string;
  desainPembelajaranLintasDisiplinIlmu: string;
  desainPembelajaranPraktikPedagogis: string;
  desainPembelajaranKemitraanPembelajaran: string[];
  desainPembelajaranLingkunganPembelajaran: string[];
  desainPembelajaranPemanfaatanDigital: string[];

  // 4. Rencana Pelaksanaan Pembelajaran
  rencanaPelaksanaanAwal: string[];
  rencanaPelaksanaanInti: string;
  kegiatanHarian: HariKegiatan[];
  rencanaPelaksanaanPenutup: string[];

  // 5. Asesmen & Instrumen
  asesmenPembelajaranAwal: string;
  asesmenPembelajaranProses: string;
  asesmenPembelajaranAkhir: string;
  lembarKerjaSiswa: string;
  rubrikPenilaian: string;
  lkpdLengkap?: string; // New field for full LKPD
  paperConfig?: PaperConfig; // Paper size configuration (A4, F4, CUSTOM)
}

export interface AutofillRequest {
  field: string;
  text?: string;
  context?: Partial<ModulAjarData>;
}

export interface AutofillResponse {
  status: number;
  data?: string;
  message?: string;
}

export interface GenerateFullModulRequest {
  credentials: Partial<ModulAjarData>;
  fokusPembelajaran?: string;
}
