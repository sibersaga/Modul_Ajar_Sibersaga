import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FormGeneralInfo } from './components/FormGeneralInfo';
import { FormObjectives } from './components/FormObjectives';
import { FormDailyActivities } from './components/FormDailyActivities';
import { FormAssessment } from './components/FormAssessment';
import { DocumentPreview } from './components/DocumentPreview';
import { AiGenerateModal } from './components/AiGenerateModal';
import { SavedModulesModal } from './components/SavedModulesModal';
import { ValidationBanner } from './components/ValidationBanner';
import { ValidationAlertModal } from './components/ValidationAlertModal';
import { LkpdGeneratorModal } from './components/LkpdGeneratorModal';
import { PRESET_MODUL_AJAR } from './data/presets';
import { ModulAjarData, HariKegiatan } from './types';
import { generateDocxBlob } from './utils/docxGenerator';
import { inferDefaultPrinsip, inferDefaultSintaks } from './data/learningModels';
import { validateModulAjar, scrollToAndHighlightElement } from './utils/validation';
import { Sparkles, Eye, FileEdit, CheckCircle2, ShieldCheck, AlertCircle, FileSpreadsheet } from 'lucide-react';

export function App() {
  const [formData, setFormData] = useState<ModulAjarData>(() => {
    try {
      const saved = localStorage.getItem('modul_ajar_active_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.kegiatanHarian)) {
          parsed.kegiatanHarian = parsed.kegiatanHarian.map((h: any, hIdx: number) => ({
            ...h,
            kegiatan: (h.kegiatan || []).map((k: any, kIdx: number) => ({
              ...k,
              prinsipDeepLearning: k.prinsipDeepLearning || inferDefaultPrinsip(h.tahap, kIdx),
              sintaksModel: k.sintaksModel || inferDefaultSintaks(parsed.modelPembelajaran, hIdx, kIdx, parsed.kegiatanHarian.length),
            })),
          }));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PRESET_MODUL_AJAR['sd-fase-a-keluarga'];
  });

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLkpdModalOpen, setIsLkpdModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Tersimpan otomatis');

  // Form Validation States
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationActionType, setValidationActionType] = useState<'download' | 'generate' | 'print'>('download');

  // Real-time validation summary
  const validationSummary = useMemo(() => validateModulAjar(formData), [formData]);

  // Autosave active draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('modul_ajar_active_draft', JSON.stringify(formData));
      setSaveStatus('Tersimpan otomatis');
    } catch (e) {
      console.error(e);
    }
  }, [formData]);

  const handleFieldChange = (field: keyof ModulAjarData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleGoToField = (elementId: string) => {
    setActiveTab('form');
    setShowValidationErrors(true);
    scrollToAndHighlightElement(elementId);
  };

  const handleAlokasiChange = (val: string) => {
    handleFieldChange('alokasiWaktu', val);

    // Parse "N x M JP"
    const match = val.match(/(\d+)\s*[xX]\s*(\d+)/);
    if (match) {
      const totalHari = parseInt(match[1], 10);
      const jpPerHari = parseInt(match[2], 10);

      if (totalHari > 0 && totalHari <= 14) {
        setFormData((prev) => {
          const currentList = prev.kegiatanHarian || [];
          const nextList: HariKegiatan[] = [];

          for (let h = 1; h <= totalHari; h++) {
            const existingDay = currentList[h - 1];
            const defaultTahap =
              h <= Math.ceil(totalHari * 0.4)
                ? 'MEMAHAMI'
                : h <= Math.ceil(totalHari * 0.8)
                ? 'MENGAPLIKASI'
                : 'MEREFLEKSI';

            if (existingDay) {
              // Adjust activities inside existing day if needed
              const kegs = [...existingDay.kegiatan];
              while (kegs.length < jpPerHari) {
                const nextJp = kegs.length + 1;
                kegs.push({
                  jp: nextJp,
                  judul: `Aktivitas Belajar ${nextJp}`,
                  dimensi: 'Penalaran Kritis & Kolaborasi',
                  alatBahan: 'Buku, alat tulis, media pembelajaran',
                  deskripsi: 'Peserta didik melaksanakan eksplorasi terarah.',
                  langkah: ['Mengamati materi', 'Mendiskusikan pemahaman'],
                });
              }
              nextList.push({
                ...existingDay,
                hari: h,
                tahap: existingDay.tahap || defaultTahap,
                kegiatan: kegs.slice(0, Math.max(1, jpPerHari)),
              });
            } else {
              // Create new day
              const kegs = [];
              for (let j = 1; j <= jpPerHari; j++) {
                kegs.push({
                  jp: j,
                  judul: `Aktivitas Belajar ${j}`,
                  dimensi: 'Penalaran Kritis & Kolaborasi',
                  alatBahan: 'Buku, alat tulis, media pembelajaran',
                  deskripsi: 'Peserta didik melaksanakan eksplorasi terarah.',
                  langkah: ['Mengamati materi', 'Mendiskusikan pemahaman'],
                });
              }
              nextList.push({
                hari: h,
                tahap: defaultTahap,
                kegiatan: kegs,
              });
            }
          }

          return {
            ...prev,
            alokasiWaktu: val,
            kegiatanHarian: nextList,
          };
        });
      }
    }
  };

  const handleLoadPreset = (key: string) => {
    const preset = PRESET_MODUL_AJAR[key];
    if (preset) {
      if (confirm(`Ganti data saat ini dengan template "${preset.judulModul}"?`)) {
        setFormData({ ...preset, updatedAt: new Date().toISOString() });
      }
    }
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh isi formulir?')) {
      setFormData({
        namaSekolah: 'SDN 3 Purwosari',
        namaPenyusun: '',
        nip: '',
        jenjang: 'SD',
        fase: 'A',
        kelas: 'Kelas 1',
        semester: 1,
        bulan: 'Agustus',
        mingguKe: 1,
        alokasiWaktu: '5 x 3 JP',
        jumlahAnak: '28',
        modelPembelajaran: 'Problem Based Learning (PBL)',
        temaSubtema: '',
        elemenCp: '',
        dimensiProfilLulusan: ['Penalaran Kritis', 'Kolaborasi / Gotong Royong', 'Kemandirian'],
        identifikasiPesertaDidik: '',
        materiPembelajaran: '',
        tujuanPembelajaran: '',
        topikPembelajaran: '',
        desainPembelajaranLintasDisiplinIlmu: '',
        desainPembelajaranPraktikPedagogis: '',
        desainPembelajaranKemitraanPembelajaran: ['Guru sebagai fasilitator', 'Orang tua sebagai pendamping'],
        desainPembelajaranLingkunganPembelajaran: ['Ruang kelas ramah anak'],
        desainPembelajaranPemanfaatanDigital: ['Media tayang interaktif'],
        rencanaPelaksanaanAwal: ['Salam, sapa, dan doa bersama', 'Apersepsi dan pemantik semangat'],
        rencanaPelaksanaanInti: 'Pembelajaran mendalam dilaksanakan melalui 3 tahap: Memahami, Mengaplikasi, Merefleksi.',
        kegiatanHarian: [
          {
            hari: 1,
            tahap: 'MEMAHAMI',
            kegiatan: [
              {
                jp: 1,
                judul: 'Mengenal Konsep Awal',
                deskripsi: 'Guru memantik diskusi mengenai materi baru.',
                dimensi: 'Penalaran Kritis',
                alatBahan: 'Buku panduan',
                langkah: ['Mengamati ilustrasi', 'Bertanya jawab aktif'],
              },
            ],
          },
        ],
        rencanaPelaksanaanPenutup: ['Refleksi perasaan belajar', 'Doa penutup dan salam'],
        asesmenPembelajaranAwal: '',
        asesmenPembelajaranProses: '',
        asesmenPembelajaranAkhir: '',
        lembarKerjaSiswa: '',
        rubrikPenilaian: '',
      });
    }
  };

  const executeDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      // First attempt server-side generation
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let blob: Blob;
      if (response.ok) {
        blob = await response.blob();
      } else {
        // Fallback to client-side DOCX generator
        console.warn('Server DOCX endpoint returned non-200, using client generator fallback');
        blob = await generateDocxBlob(formData);
      }

      const cleanFilename = `Modul_Ajar_${(formData.temaSubtema || 'Kurikulum_Merdeka').replace(
        /[^a-zA-Z0-9_-]/g,
        '_'
      )}.docx`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = cleanFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error('Download error:', err);
      // Fallback to client generator if server call failed entirely
      try {
        const blob = await generateDocxBlob(formData);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Modul_Ajar_${(formData.temaSubtema || 'Kurikulum_Merdeka').replace(
          /[^a-zA-Z0-9_-]/g,
          '_'
        )}.docx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (clientErr: any) {
        alert('Gagal mengunduh dokumen Word: ' + clientErr.message);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDocx = () => {
    if (!validationSummary.isValid) {
      setShowValidationErrors(true);
      setValidationActionType('download');
      setIsValidationModalOpen(true);
      return;
    }
    executeDownloadDocx();
  };

  const executePrint = () => {
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handlePrint = () => {
    if (!validationSummary.isValid) {
      setShowValidationErrors(true);
      setValidationActionType('print');
      setIsValidationModalOpen(true);
      return;
    }
    executePrint();
  };

  const handleAiFullGenerated = (newFields: Partial<ModulAjarData>) => {
    setFormData((prev) => ({
      ...prev,
      ...newFields,
      updatedAt: new Date().toISOString(),
    }));
    setActiveTab('form');
  };

  const handleApplyLkpd = (fullLkpd: string, summary: string) => {
    setFormData((prev) => ({
      ...prev,
      lkpdLengkap: fullLkpd,
      lembarKerjaSiswa: summary || prev.lembarKerjaSiswa,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top App Header */}
      <Header
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
        onOpenLkpdGenerator={() => setIsLkpdModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onDownloadDocx={handleDownloadDocx}
        onPrint={handlePrint}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        isDownloading={isDownloading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Floating Quick Action / Status Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-xs border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">Status Sistem:</span>
            <span>Gemini AI Aktif</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{saveStatus}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="magic-ai-banner-btn"
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sihir AI Buat Modul</span>
            </button>
            <button
              type="button"
              id="banner-create-lkpd-btn"
              onClick={() => setIsLkpdModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Buat LKPD otomatis sesuai modul ajar ini"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buat LKPD</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'form' ? 'preview' : 'form')}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              {activeTab === 'form' ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Pratinjau Dokumen</span>
                </>
              ) : (
                <>
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Kembali ke Formulir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Switch */}
        {activeTab === 'form' ? (
          <div className="space-y-6">
            {/* Real-time Validation Progress & Warning Banner */}
            <ValidationBanner
              summary={validationSummary}
              showErrors={showValidationErrors}
              onGoToField={handleGoToField}
              onOpenValidationModal={() => setIsValidationModalOpen(true)}
            />

            <FormGeneralInfo
              data={formData}
              onChange={handleFieldChange}
              onAlokasiChange={handleAlokasiChange}
              validationErrors={validationSummary.errorMap}
              showErrors={showValidationErrors}
            />

            <FormObjectives
              data={formData}
              onChange={handleFieldChange}
              validationErrors={validationSummary.errorMap}
              showErrors={showValidationErrors}
            />

            <FormDailyActivities
              data={formData}
              onChange={handleFieldChange}
              validationErrors={validationSummary.errorMap}
              showErrors={showValidationErrors}
            />

            <FormAssessment
              data={formData}
              onChange={handleFieldChange}
              onOpenLkpdGenerator={() => setIsLkpdModalOpen(true)}
              validationErrors={validationSummary.errorMap}
              showErrors={showValidationErrors}
            />

            {/* Bottom Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Modul Ajar Siap Diekspor
                </h4>
                <p className="text-xs text-slate-500">
                  Periksa pratinjau dokumen atau unduh langsung dalam format Microsoft Word (.docx).
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Pratinjau Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>{isDownloading ? 'Mengunduh...' : 'Unduh Word (.docx)'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <DocumentPreview
            data={formData}
            onDownloadDocx={handleDownloadDocx}
            onPrint={handlePrint}
            onOpenLkpdGenerator={() => setIsLkpdModalOpen(true)}
            isDownloading={isDownloading}
          />
        )}
      </main>

      {/* Modals */}
      <LkpdGeneratorModal
        isOpen={isLkpdModalOpen}
        onClose={() => setIsLkpdModalOpen(false)}
        modulData={formData}
        onApplyLkpd={handleApplyLkpd}
      />

      <ValidationAlertModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        errors={validationSummary.errors}
        onGoToField={handleGoToField}
        actionType={validationActionType}
        onForceProceed={validationActionType === 'download' ? executeDownloadDocx : executePrint}
      />

      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentData={formData}
        onGenerated={handleAiFullGenerated}
      />

      <SavedModulesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentData={formData}
        onLoadModule={(mod) => setFormData(mod)}
      />
    </div>
  );
}

export default App;
