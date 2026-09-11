export interface ModelSintaksInfo {
  name: string;
  sintaks: string[];
}

export const PRINSIP_DEEP_LEARNING_OPTIONS = [
  'Bermakna (Meaningful Learning)',
  'Berkesadaran (Mindful Learning)',
  'Menggembirakan (Joyful Learning)',
  'Berkesadaran & Bermakna',
  'Bermakna & Menggembirakan',
  'Berkesadaran & Menggembirakan',
  'Berkesadaran, Bermakna, & Menggembirakan',
] as const;

export const MODEL_SINTAKS_MAP: Record<string, string[]> = {
  'Problem Based Learning (PBL)': [
    'Tahap 1: Orientasi peserta didik pada masalah kontekstual',
    'Tahap 2: Mengorganisasikan peserta didik untuk belajar & meneliti',
    'Tahap 3: Membimbing penyelidikan mandiri maupun kelompok',
    'Tahap 4: Mengembangkan dan menyajikan hasil karya / solusi',
    'Tahap 5: Menganalisis dan mengevaluasi proses pemecahan masalah',
  ],
  'Project Based Learning (PjBL)': [
    'Tahap 1: Penentuan pertanyaan mendasar (Essential Question)',
    'Tahap 2: Mendesain perencanaan proyek (Design Project Plan)',
    'Tahap 3: Menyusun jadwal pembuatan (Create Project Schedule)',
    'Tahap 4: Memonitor keaktifan dan kemajuan proyek (Monitor Progress)',
    'Tahap 5: Menguji hasil dan asesmen produk (Assess Outcome)',
    'Tahap 6: Evaluasi pengalaman belajar (Evaluate Experience)',
  ],
  'Discovery Learning': [
    'Tahap 1: Pemberian rangsangan / Stimulasi (Stimulation)',
    'Tahap 2: Identifikasi masalah / Pernyataan masalah (Problem Statement)',
    'Tahap 3: Pengumpulan data (Data Collection)',
    'Tahap 4: Pengolahan data (Data Processing)',
    'Tahap 5: Pembuktian (Verification)',
    'Tahap 6: Menarik kesimpulan / Generalisasi (Generalization)',
  ],
  'Inquiry Learning': [
    'Tahap 1: Orientasi dan perumusan masalah investigatif',
    'Tahap 2: Perumusan hipotesis / gagasan awal',
    'Tahap 3: Eksplorasi & pengumpulan data eksperimen/observasi',
    'Tahap 4: Pengujian hipotesis dan analisis data',
    'Tahap 5: Perumusan kesimpulan dan refleksi konsep',
  ],
  'Experiential Learning (Deep Learning)': [
    'Tahap 1: Pengalaman konkret (Concrete Experience)',
    'Tahap 2: Observasi reflektif (Reflective Observation)',
    'Tahap 3: Konseptualisasi abstrak (Abstract Conceptualization)',
    'Tahap 4: Eksperimentasi aktif (Active Experimentation)',
  ],
  'Sentra / Area Bermain Eksploratif': [
    'Tahap 1: Pijakan lingkungan main (Setting Environment)',
    'Tahap 2: Pijakan pengalaman sebelum main (Pre-play Scaffolding)',
    'Tahap 3: Pijakan pengalaman saat main (Individual Scaffolding)',
    'Tahap 4: Pijakan pengalaman setelah main / Recalling',
  ],
  'Tatap Muka Interaktif Terbimbing': [
    'Tahap 1: Pemodelan konsep & demonstrasi interaktif (Modeling)',
    'Tahap 2: Latihan terbimbing bersama kelompok (Guided Practice)',
    'Tahap 3: Penerapan mandiri / kolaborasi aktif (Independent Practice)',
    'Tahap 4: Umpan balik formatif dan penguatan konsep (Feedback)',
  ],
};

export function getSintaksOptions(modelName: string): string[] {
  if (!modelName) return MODEL_SINTAKS_MAP['Problem Based Learning (PBL)'];

  // Try exact match
  if (MODEL_SINTAKS_MAP[modelName]) {
    return MODEL_SINTAKS_MAP[modelName];
  }

  // Try partial match
  const lower = modelName.toLowerCase();
  if (lower.includes('project') || lower.includes('pjbl')) {
    return MODEL_SINTAKS_MAP['Project Based Learning (PjBL)'];
  }
  if (lower.includes('problem') || lower.includes('pbl')) {
    return MODEL_SINTAKS_MAP['Problem Based Learning (PBL)'];
  }
  if (lower.includes('discovery')) {
    return MODEL_SINTAKS_MAP['Discovery Learning'];
  }
  if (lower.includes('inquiry')) {
    return MODEL_SINTAKS_MAP['Inquiry Learning'];
  }
  if (lower.includes('experiential') || lower.includes('mendalam')) {
    return MODEL_SINTAKS_MAP['Experiential Learning (Deep Learning)'];
  }
  if (lower.includes('sentra') || lower.includes('area')) {
    return MODEL_SINTAKS_MAP['Sentra / Area Bermain Eksploratif'];
  }
  return MODEL_SINTAKS_MAP['Tatap Muka Interaktif Terbimbing'];
}

export function inferDefaultPrinsip(tahap: string, jpIndex: number): string {
  if (tahap === 'MEMAHAMI') {
    return jpIndex === 0 ? 'Berkesadaran (Mindful Learning)' : 'Bermakna (Meaningful Learning)';
  }
  if (tahap === 'MENGAPLIKASI') {
    return jpIndex % 2 === 0 ? 'Bermakna & Menggembirakan' : 'Menggembirakan (Joyful Learning)';
  }
  if (tahap === 'MEREFLEKSI') {
    return 'Berkesadaran (Mindful Learning)';
  }
  return 'Bermakna (Meaningful Learning)';
}

export function inferDefaultSintaks(modelName: string, dayIndex: number, jpIndex: number, totalDays: number = 5): string {
  const sintaksList = getSintaksOptions(modelName);
  if (!sintaksList || sintaksList.length === 0) return 'Eksplorasi Terarah';

  // Map progress across total days and JPs
  const stepIndex = Math.min(
    sintaksList.length - 1,
    Math.floor(((dayIndex * 3 + jpIndex) / (totalDays * 3)) * sintaksList.length)
  );

  return sintaksList[stepIndex] || sintaksList[0];
}
