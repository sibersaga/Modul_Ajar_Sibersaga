import React, { useState } from 'react';
import { X, Sparkles, Wand2, Loader2, BookOpen, Layers } from 'lucide-react';
import { ModulAjarData } from '../types';

interface AiGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ModulAjarData;
  onGenerated: (fullData: Partial<ModulAjarData>) => void;
}

export const AiGenerateModal: React.FC<AiGenerateModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generateLKPD, setGenerateLKPD] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const fokus = `Tema: ${currentData.temaSubtema || ''}, CP: ${currentData.elemenCp || ''}`;

    try {
      const res = await fetch('/api/ai/generate-full-modul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials: {
            namaSekolah: currentData.namaSekolah,
            namaPenyusun: currentData.namaPenyusun,
            jenjang: currentData.jenjang,
            fase: currentData.fase,
            kelas: currentData.kelas,
            semester: currentData.semester,
            bulan: currentData.bulan,
            mingguKe: currentData.mingguKe,
            alokasiWaktu: currentData.alokasiWaktu,
            temaSubtema: currentData.temaSubtema,
            elemenCp: currentData.elemenCp,
          },
          fokusPembelajaran: fokus,
          generateLKPD: generateLKPD,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: Gagal menyusun modul.`);
      }

      const json = await res.json();
      if (json.data) {
        onGenerated(json.data);
        onClose();
      } else {
        throw new Error('Format balasan AI tidak sesuai.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyusun modul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sihir AI: Susun Lengkap Modul Ajar
              </h3>
              <p className="text-xs text-slate-500">
                Otomasi seluruh komponen Kurikulum Merdeka & Deep Learning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <p className="text-sm text-slate-700 mb-2">
            AI akan menyusun seluruh modul ajar secara mendalam berdasarkan Identitas Dokumen, Tema, dan CP yang telah Anda masukkan pada Bagian 1.
          </p>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Komponen yang Dihasilkan:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 pl-1">
              <li>Capaian Pembelajaran (CP) & Dimensi Profil Pelajar Pancasila</li>
              <li>Tujuan Pembelajaran & Karakteristik Peserta Didik</li>
              <li>Alur Kegiatan Mendalam 5 Hari (Memahami, Mengaplikasi, Merefleksi)</li>
              <li>Asesmen Diagnostik, Formatif, Sumatif, LKPD & Rubrik Penilaian</li>
            </ul>
          </div>

          <label className="flex items-center gap-2 mt-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={generateLKPD}
              onChange={(e) => setGenerateLKPD(e.target.checked)}
              className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">Buat LKPD Lengkap</span>
              <span className="text-[11px] text-slate-500">Otomatis membuat lampiran LKPD di akhir modul</span>
            </div>
          </label>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyusun Seluruh Modul...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Susun Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
