import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Printer,
  Save,
  Wand2,
  Edit3,
  X,
  BookOpen,
  School,
  Target,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { ModulAjarData } from '../types';
import { buildLkpdPrompt, generateLocalFallbackLkpd, LkpdPromptOptions } from '../utils/lkpdPromptBuilder';
import { LkpdViewer } from './LkpdViewer';

interface LkpdGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  modulData: ModulAjarData;
  onApplyLkpd: (fullLkpd: string, summary: string) => void;
}

export const LkpdGeneratorModal: React.FC<LkpdGeneratorModalProps> = ({
  isOpen,
  onClose,
  modulData,
  onApplyLkpd,
}) => {
  const [activityType, setActivityType] = useState<LkpdPromptOptions['activityType']>('campuran');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficultyLevel, setDifficultyLevel] = useState<LkpdPromptOptions['difficultyLevel']>('sesuai_fase');
  const [additionalFocus, setAdditionalFocus] = useState<string>('');

  const [promptText, setPromptText] = useState<string>('');
  const [isPromptCustomized, setIsPromptCustomized] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Result state
  const [generatedLkpd, setGeneratedLkpd] = useState<string>(modulData.lkpdLengkap || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedResult, setCopiedResult] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'result'>('prompt');
  const [isEditingResult, setIsEditingResult] = useState<boolean>(false);

  // Auto-compose prompt whenever modal opens or options change (if user hasn't heavily customized manually)
  const defaultPrompt = useMemo(() => {
    return buildLkpdPrompt(modulData, {
      activityType,
      questionCount,
      difficultyLevel,
      additionalFocus,
    });
  }, [modulData, activityType, questionCount, difficultyLevel, additionalFocus]);

  useEffect(() => {
    if (isOpen) {
      if (!isPromptCustomized) {
        setPromptText(defaultPrompt);
      }
      if (modulData.lkpdLengkap && !generatedLkpd) {
        setGeneratedLkpd(modulData.lkpdLengkap);
      }
      // If LKPD already exists, default to result tab, else prompt tab
      if (modulData.lkpdLengkap && !generatedLkpd) {
        setActiveTab('result');
      }
    }
  }, [isOpen, defaultPrompt, isPromptCustomized, modulData.lkpdLengkap]);

  if (!isOpen) return null;

  const handleResetPrompt = () => {
    setPromptText(defaultPrompt);
    setIsPromptCustomized(false);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(generatedLkpd);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleGenerateLkpd = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setActiveTab('result');
    setGenerationStep('Menghubungkan asisten AI Kurikulum Merdeka...');

    try {
      setGenerationStep('Menyusun lembar kerja aktif dan tugas kontekstual...');
      const res = await fetch('/api/ai/generate-lkpd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          modulContext: {
            namaSekolah: modulData.namaSekolah,
            jenjang: modulData.jenjang,
            kelas: modulData.kelas,
            temaSubtema: modulData.temaSubtema,
            topikPembelajaran: modulData.topikPembelajaran,
            materiPembelajaran: modulData.materiPembelajaran,
            tujuanPembelajaran: modulData.tujuanPembelajaran,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const json = await res.json();
      if (json.status === 200 && json.data) {
        setGeneratedLkpd(json.data);
      } else {
        throw new Error(json.message || 'Gagal menghasilkan teks LKPD');
      }
    } catch (err: any) {
      console.info('API LKPD generation failed, falling back to rich local generator:', err);
      // High quality local fallback so the user always gets a complete LKPD!
      const fallback = generateLocalFallbackLkpd(modulData);
      setGeneratedLkpd(fallback);
      setErrorMessage(
        'AI server sedang offline atau kunci API belum disetel. Sistem telah menyusun LKPD komprehensif berkualitas tinggi secara otomatis dari modul ajar Anda.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleApplyToModule = () => {
    if (!generatedLkpd) return;

    // Create a concise summary for the module's 1-page table
    const firstLines = generatedLkpd
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('===') && !l.startsWith('---'));

    const titleLine = firstLines.find((l) => l.toLowerCase().includes('judul') || l.toLowerCase().includes('lkpd')) || 'LKPD Eksplorasi';
    const summary = `LKPD: ${titleLine.replace(/^judul\s*kegiatan\s*:\s*/i, '')}. Terdiri dari stimulus pemantik kontekstual, ${questionCount} soal/tugas variatif (pilihan ganda, menjodohkan, isian singkat, dan kreasi), refleksi siswa, serta rubrik penilaian guru. (Dokumen Lengkap terlampir di halaman lampiran LKPD).`;

    onApplyLkpd(generatedLkpd, summary);
    onClose();
  };

  const handlePrintLkpdOnly = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup terblokir, mohon izinkan popup untuk mencetak LKPD.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LKPD - ${modulData.temaSubtema || 'Kurikulum Merdeka'}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 0; padding: 20px; }
            h1, h2, h3 { text-align: center; margin: 5px 0; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; }
            .header-box { border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 15px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h2 style="margin: 0; text-transform: uppercase;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
            <h3 style="margin: 4px 0 0 0; font-weight: normal;">${modulData.namaSekolah || 'SDN 3 PURWOSARI'}</h3>
          </div>
          <pre>${generatedLkpd}</pre>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Generator LKPD Otomatis Berbasis Modul Ajar
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5" /> Prompt Otomatis
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Prompt disintesis otomatis dari Tema, Topik, Materi, dan Tujuan Pembelajaran modul saat ini.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modul Context Bar (Badges showing auto-extracted fields) */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs flex-shrink-0">
          <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
            Sumber Data:
          </span>
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium text-[11px] shadow-2xs">
            <School className="w-3 h-3 text-indigo-600" />
            {modulData.namaSekolah || 'SDN 3 Purwosari'}
          </span>
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium text-[11px] shadow-2xs">
            <BookOpen className="w-3 h-3 text-emerald-600" />
            {modulData.jenjang || 'SD'} • {modulData.kelas || 'Kelas 1'}
          </span>
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium text-[11px] shadow-2xs max-w-xs truncate" title={modulData.temaSubtema}>
            <span className="font-bold text-slate-900">Tema:</span> {modulData.temaSubtema || 'Belum diisi'}
          </span>
          {modulData.topikPembelajaran && (
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium text-[11px] shadow-2xs max-w-xs truncate" title={modulData.topikPembelajaran}>
              <Target className="w-3 h-3 text-amber-600" />
              <span className="font-bold text-slate-900">Topik:</span> {modulData.topikPembelajaran}
            </span>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-200 flex gap-6 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            1. Periksa & Kustomisasi Prompt Otomatis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('result')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'result'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            2. Hasil Lembar Kerja (LKPD)
            {generatedLkpd && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'prompt' ? (
            <div className="space-y-5 animate-fade-in">
              {/* Option Presets */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Opsi Spesifikasi LKPD Otomatis
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Tipe Aktivitas */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Format Aktivitas Siswa
                    </label>
                    <select
                      value={activityType}
                      onChange={(e) => {
                        setActivityType(e.target.value as any);
                        setIsPromptCustomized(false);
                      }}
                      className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="campuran">Campuran (Mandiri & Diskusi)</option>
                      <option value="individu">Individu / Mandiri</option>
                      <option value="kelompok">Kelompok Kolaboratif</option>
                      <option value="luar_kelas">Eksplorasi Luar Kelas / Sekitar</option>
                    </select>
                  </div>

                  {/* Jumlah Soal */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Jumlah Soal / Tugas LKPD
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => {
                        setQuestionCount(Number(e.target.value));
                        setIsPromptCustomized(false);
                      }}
                      className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value={3}>3 Soal (Ringkas & Cepat)</option>
                      <option value={5}>5 Soal (Standar Rekomendasi)</option>
                      <option value={7}>7 Soal (Lengkap & Mendalam)</option>
                      <option value={10}>10 Soal (Komprehensif)</option>
                    </select>
                  </div>

                  {/* Tingkat Kesulitan */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tingkat Kesulitan & Gaya
                    </label>
                    <select
                      value={difficultyLevel}
                      onChange={(e) => {
                        setDifficultyLevel(e.target.value as any);
                        setIsPromptCustomized(false);
                      }}
                      className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="sesuai_fase">Sesuai Usia & Fase Peserta Didik</option>
                      <option value="mudah">Ramah Pemula (Dengan Panduan Visual)</option>
                      <option value="menantang_hots">Menantang & Bernalar Kritis (HOTS)</option>
                    </select>
                  </div>
                </div>

                {/* Catatan / Fokus Tambahan */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Catatan Khusus / Tambahan Guru (Opsional)
                  </label>
                  <input
                    type="text"
                    value={additionalFocus}
                    onChange={(e) => {
                      setAdditionalFocus(e.target.value);
                      setIsPromptCustomized(false);
                    }}
                    placeholder="Contoh: Sertakan aktivitas menggambar pohon keluarga dan menempel stiker"
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Prompt Editor Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-800">
                      Teks Prompt LKPD yang Diramu Otomatis
                    </label>
                    {isPromptCustomized && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Disesuaikan Manual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetPrompt}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
                      title="Kembalikan prompt ke teks bawaan hasil sintesis modul"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Prompt
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <textarea
                  rows={13}
                  value={promptText}
                  onChange={(e) => {
                    setPromptText(e.target.value);
                    setIsPromptCustomized(true);
                  }}
                  className="w-full font-mono text-xs leading-relaxed rounded-xl border border-slate-300 p-3.5 text-slate-800 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all resize-y shadow-2xs"
                />
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  Anda dapat mengubah langsung kalimat perintah di atas sebelum mengirimkannya ke AI, atau langsung menekan tombol hijau di bawah.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Generation State */}
              {isGenerating ? (
                <div className="p-12 text-center bg-emerald-50/40 rounded-2xl border border-emerald-200 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Sedang Menyusun LKPD Berkualitas Tinggi...
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium mt-1 animate-pulse">
                      {generationStep}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2 max-w-md">
                      AI sedang merumuskan stimulus apersepsi, petunjuk ramah anak, {questionCount} soal bervariasi, refleksi diri, serta kunci jawaban & rubrik penilaian.
                    </p>
                  </div>
                </div>
              ) : generatedLkpd ? (
                <div className="space-y-3">
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>{errorMessage}</div>
                    </div>
                  )}

                  {/* Enhanced Visual & Structured LKPD Viewer */}
                  <LkpdViewer
                    content={generatedLkpd}
                    modulData={modulData}
                    onChangeContent={setGeneratedLkpd}
                    onPrint={handlePrintLkpdOnly}
                    isEditable={true}
                    compact={true}
                  />
                </div>
              ) : (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">Belum Ada LKPD yang Dibuat</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Kembali ke tab 1 untuk memeriksa prompt otomatis modul ajar Anda, lalu klik "Generate LKPD dengan AI".
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('prompt')}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                  >
                    <span>Lihat Prompt Otomatis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-slate-500">
            {activeTab === 'prompt'
              ? 'AI siap merangkai LKPD sesuai fase dan tema'
              : generatedLkpd
              ? 'Terapkan untuk menyertakan LKPD di lampiran Word & formulir'
              : ''}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 rounded-lg transition-all cursor-pointer"
            >
              Tutup
            </button>

            {activeTab === 'prompt' ? (
              <button
                type="button"
                id="modal-generate-lkpd-now-btn"
                onClick={handleGenerateLkpd}
                disabled={isGenerating || !promptText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white rounded-lg shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Generate LKPD Sekarang</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('prompt');
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  Ubah Prompt
                </button>
                <button
                  type="button"
                  id="modal-apply-lkpd-btn"
                  onClick={handleApplyToModule}
                  disabled={!generatedLkpd}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-lg shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Terapkan ke Modul Ajar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
