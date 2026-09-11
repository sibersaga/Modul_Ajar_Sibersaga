import { ModulAjarData } from '../types';

export interface ValidationErrorItem {
  field: string;
  label: string;
  section: 'identitas' | 'capaian' | 'rpp' | 'asesmen';
  sectionTitle: string;
  message: string;
  elementId: string;
}

export interface ValidationSummary {
  isValid: boolean;
  errors: ValidationErrorItem[];
  errorMap: Record<string, string>;
  totalRequired: number;
  completedCount: number;
  percentComplete: number;
  firstError?: ValidationErrorItem;
}

export const REQUIRED_FIELDS_CONFIG: Array<{
  field: keyof ModulAjarData | 'kegiatanHarianValid';
  label: string;
  section: 'identitas' | 'capaian' | 'rpp' | 'asesmen';
  sectionTitle: string;
  elementId: string;
  validate: (data: ModulAjarData) => boolean;
  message: string;
}> = [
  // 1. Informasi Umum
  {
    field: 'namaSekolah',
    label: 'Satuan Pendidikan (Nama Sekolah)',
    section: 'identitas',
    sectionTitle: '1. Informasi Umum',
    elementId: 'input-namaSekolah',
    validate: (data) => Boolean(data.namaSekolah?.trim()),
    message: 'Satuan Pendidikan / Nama Sekolah wajib diisi.',
  },
  {
    field: 'namaPenyusun',
    label: 'Nama Guru / Penyusun',
    section: 'identitas',
    sectionTitle: '1. Informasi Umum',
    elementId: 'input-namaPenyusun',
    validate: (data) => Boolean(data.namaPenyusun?.trim()),
    message: 'Nama Guru / Penyusun wajib diisi.',
  },
  {
    field: 'kelas',
    label: 'Kelas / Kelompok',
    section: 'identitas',
    sectionTitle: '1. Informasi Umum',
    elementId: 'input-kelas',
    validate: (data) => Boolean(data.kelas?.trim()),
    message: 'Kelas / Kelompok sasaran wajib diisi.',
  },
  {
    field: 'alokasiWaktu',
    label: 'Alokasi Waktu',
    section: 'identitas',
    sectionTitle: '1. Informasi Umum',
    elementId: 'input-alokasiWaktu',
    validate: (data) => Boolean(data.alokasiWaktu?.trim()),
    message: 'Alokasi waktu pembelajaran wajib diisi (contoh: 5 x 3 JP).',
  },

  // 2. Tema & Capaian
  {
    field: 'temaSubtema',
    label: 'Tema & Subtema Pembelajaran',
    section: 'capaian',
    sectionTitle: '2. Tema & Capaian',
    elementId: 'input-temaSubtema',
    validate: (data) => Boolean(data.temaSubtema?.trim()),
    message: 'Tema & Subtema atau Mata Pelajaran wajib diisi.',
  },
  {
    field: 'elemenCp',
    label: 'Elemen Capaian Pembelajaran (CP)',
    section: 'capaian',
    sectionTitle: '2. Tema & Capaian',
    elementId: 'input-elemenCp',
    validate: (data) => Boolean(data.elemenCp?.trim()),
    message: 'Elemen Capaian Pembelajaran (CP) wajib diisi.',
  },
  {
    field: 'materiPembelajaran',
    label: 'Materi Pembelajaran',
    section: 'capaian',
    sectionTitle: '2. Tema & Capaian',
    elementId: 'input-materiPembelajaran',
    validate: (data) => Boolean(data.materiPembelajaran?.trim()),
    message: 'Uraian materi pokok pembelajaran wajib diisi.',
  },
  {
    field: 'tujuanPembelajaran',
    label: 'Tujuan Pembelajaran (TP)',
    section: 'capaian',
    sectionTitle: '2. Tema & Capaian',
    elementId: 'input-tujuanPembelajaran',
    validate: (data) => Boolean(data.tujuanPembelajaran?.trim()),
    message: 'Rumusan Tujuan Pembelajaran (TP) wajib diisi.',
  },
  {
    field: 'topikPembelajaran',
    label: 'Topik Pembelajaran Spesifik',
    section: 'capaian',
    sectionTitle: '2. Tema & Capaian',
    elementId: 'input-topikPembelajaran',
    validate: (data) => Boolean(data.topikPembelajaran?.trim()),
    message: 'Topik pembelajaran spesifik wajib diisi.',
  },

  // 3. Rencana Pelaksanaan Pembelajaran
  {
    field: 'kegiatanHarianValid',
    label: 'Aktivitas Harian Pembelajaran',
    section: 'rpp',
    sectionTitle: '3. RPP & Aktivitas Harian',
    elementId: 'section-kegiatan-harian',
    validate: (data) => {
      if (!Array.isArray(data.kegiatanHarian) || data.kegiatanHarian.length === 0) {
        return false;
      }
      return data.kegiatanHarian.some(
        (h) => Array.isArray(h.kegiatan) && h.kegiatan.some((k) => Boolean(k.judul?.trim()))
      );
    },
    message: 'Minimal terdapat 1 hari kegiatan pembelajaran dengan aktivitas terisi.',
  },

  // 4. Asesmen & Instrumen
  {
    field: 'asesmenPembelajaranProses',
    label: 'Asesmen Pembelajaran (Formatif/Awal)',
    section: 'asesmen',
    sectionTitle: '4. Asesmen & Evaluasi',
    elementId: 'input-asesmenProses',
    validate: (data) =>
      Boolean(data.asesmenPembelajaranProses?.trim() || data.asesmenPembelajaranAwal?.trim()),
    message: 'Rancangan asesmen proses atau diagnostik awal wajib diisi.',
  },
  {
    field: 'lembarKerjaSiswa',
    label: 'Lembar Kerja Peserta Didik (LKPD)',
    section: 'asesmen',
    sectionTitle: '4. Asesmen & Evaluasi',
    elementId: 'input-lembarKerjaSiswa',
    validate: (data) =>
      Boolean(data.lembarKerjaSiswa?.trim() || data.lkpdLengkap?.trim()),
    message: 'Lembar Kerja Peserta Didik (LKPD) atau penugasan wajib terisi.',
  },
];

export function validateModulAjar(data: ModulAjarData): ValidationSummary {
  const errors: ValidationErrorItem[] = [];
  const errorMap: Record<string, string> = {};

  let completedCount = 0;
  const totalRequired = REQUIRED_FIELDS_CONFIG.length;

  for (const rule of REQUIRED_FIELDS_CONFIG) {
    const isFieldValid = rule.validate(data);
    if (isFieldValid) {
      completedCount += 1;
    } else {
      const errorItem: ValidationErrorItem = {
        field: rule.field,
        label: rule.label,
        section: rule.section,
        sectionTitle: rule.sectionTitle,
        message: rule.message,
        elementId: rule.elementId,
      };
      errors.push(errorItem);
      errorMap[rule.field] = rule.message;
    }
  }

  const percentComplete = Math.round((completedCount / totalRequired) * 100);

  return {
    isValid: errors.length === 0,
    errors,
    errorMap,
    totalRequired,
    completedCount,
    percentComplete,
    firstError: errors[0],
  };
}

export function scrollToAndHighlightElement(elementId: string): boolean {
  const element = document.getElementById(elementId);
  if (!element) return false;

  element.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Focus if it's focusable
  if ('focus' in element && typeof (element as HTMLElement).focus === 'function') {
    (element as HTMLElement).focus({ preventScroll: true });
  }

  // Add temporary pulsing glow effect
  element.classList.add('ring-4', 'ring-rose-500/40', 'border-rose-500', 'transition-all', 'duration-300');
  setTimeout(() => {
    element.classList.remove('ring-4', 'ring-rose-500/40');
  }, 2500);

  return true;
}
