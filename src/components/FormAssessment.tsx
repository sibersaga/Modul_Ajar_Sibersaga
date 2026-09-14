import React from 'react';
import {
  ClipboardCheck,
  Sparkles,
  CheckSquare,
  FileText,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ModulAjarData } from '../types';

interface FormAssessmentProps {
  data: ModulAjarData;
  onChange: (field: keyof ModulAjarData, value: any) => void;
  onOpenLkpdGenerator?: () => void;
  validationErrors?: Record<string, string>;
  showErrors?: boolean;
}

export const FormAssessment: React.FC<FormAssessmentProps> = ({
  data,
  onChange,
  onOpenLkpdGenerator,
  validationErrors = {},
  showErrors = false,
}: FormAssessmentProps) => {
  const hasErrors =
    showErrors &&
    (validationErrors.asesmenPembelajaranProses || validationErrors.lembarKerjaSiswa);

  return (
    <div id="section-asesmen" className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              4. Asesmen Pembelajaran & Instrumen Evaluasi
            </h2>
            <p className="text-xs text-slate-500">
              Perancangan asesmen awal, formatif dalam proses, sumatif akhir, LKPD, dan rubrik penilaian.
            </p>
          </div>
        </div>
        {hasErrors && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Bidang wajib belum lengkap
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Asesmen Awal & Asesmen Proses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-asesmenAwal" className="text-xs font-semibold text-slate-700">
                Asesmen Awal (Diagnostik)
              </label>
              
            </div>
            <textarea
              id="input-asesmenAwal"
              rows={3}
              value={data.asesmenPembelajaranAwal || ''}
              onChange={(e) => onChange('asesmenPembelajaranAwal', e.target.value)}
              placeholder="Contoh: Tanya jawab informal mengenai pengetahuan awal, observasi kesiapan gerak..."
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none resize-y"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-asesmenProses" className="text-xs font-semibold text-slate-700">
                Asesmen Proses (Formatif / Observasi Berkala) <span className="text-rose-500 font-bold">*</span>
              </label>
              
            </div>
            <textarea
              id="input-asesmenProses"
              rows={3}
              value={data.asesmenPembelajaranProses || ''}
              onChange={(e) => onChange('asesmenPembelajaranProses', e.target.value)}
              placeholder="Contoh: Lembar observasi keterlibatan, catatan anekdot kerjasama..."
              className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all resize-y ${
                showErrors && validationErrors.asesmenPembelajaranProses
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
            />
            {showErrors && validationErrors.asesmenPembelajaranProses && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.asesmenPembelajaranProses}
              </p>
            )}
          </div>
        </div>

        {/* Asesmen Akhir (Sumatif) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-asesmenAkhir" className="text-xs font-semibold text-slate-700">
              Asesmen Akhir (Sumatif / Unjuk Kerja / Portofolio)
            </label>
            
          </div>
          <textarea
            id="input-asesmenAkhir"
            rows={2}
            value={data.asesmenPembelajaranAkhir || ''}
            onChange={(e) => onChange('asesmenPembelajaranAkhir', e.target.value)}
            placeholder="Contoh: Penilaian unjuk kerja kreasi pohon keluarga dan presentasi bercerita..."
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none resize-y"
          />
        </div>

        {/* Lembar Kerja Peserta Didik (LKPD) */}
        <div>
          {/* Featured LKPD Generator Card */}
          {onOpenLkpdGenerator && (
            <div className="mb-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50/30 border border-emerald-200/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs mt-0.5 flex-shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">
                        Generator LKPD Otomatis (Prompt dari Modul Ajar)
                      </h4>
                      {data.lkpdLengkap ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> LKPD Lengkap Siap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Rekomendasi
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Sistem akan menyusun prompt otomatis berisi Tema, Topik, Materi, dan TP modul ini untuk menghasilkan lembar kerja siswa berstandar Deep Learning yang siap cetak.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="form-create-lkpd-btn"
                  onClick={onOpenLkpdGenerator}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-lg shadow-sm transition-all flex-shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{data.lkpdLengkap ? 'Lihat / Edit LKPD' : 'Buat LKPD Otomatis'}</span>
                </button>
              </div>

              {data.lkpdLengkap && (
                <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
                  <span className="truncate max-w-md font-mono text-[10.5px]">
                    Lampiran LKPD Lengkap aktif ({data.lkpdLengkap.split(/\s+/).filter(Boolean).length} kata)
                  </span>
                  <button
                    type="button"
                    onClick={onOpenLkpdGenerator}
                    className="font-bold text-emerald-900 underline hover:text-emerald-950 ml-2 whitespace-nowrap cursor-pointer flex items-center gap-1"
                  >
                    Buka Editor LKPD <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-lembarKerjaSiswa" className="text-xs font-semibold text-slate-700">
              Ringkasan Lembar Kerja Peserta Didik (LKPD) / Penugasan <span className="text-rose-500 font-bold">*</span>
            </label>
            
          </div>
          <textarea
            id="input-lembarKerjaSiswa"
            rows={3}
            value={data.lembarKerjaSiswa || ''}
            onChange={(e) => onChange('lembarKerjaSiswa', e.target.value)}
            placeholder="Contoh: LKPD 1: Menjodohkan gambar peran keluarga. LKPD 2: Menempelkan foto keluarga..."
            className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all resize-y ${
              showErrors && validationErrors.lembarKerjaSiswa
                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }`}
          />
          {showErrors && validationErrors.lembarKerjaSiswa && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.lembarKerjaSiswa}
            </p>
          )}
        </div>

        {/* Rubrik Penilaian */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-rubrikPenilaian" className="text-xs font-semibold text-slate-700">
              Rubrik Penilaian & Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
            </label>
            
          </div>
          <textarea
            id="input-rubrikPenilaian"
            rows={4}
            value={data.rubrikPenilaian || ''}
            onChange={(e) => onChange('rubrikPenilaian', e.target.value)}
            placeholder="Contoh: Kriteria 1: Pemahaman konsep (Perlu Bimbingan / Cukup / Baik / Sangat Baik)..."
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};
