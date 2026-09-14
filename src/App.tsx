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
import { PRESET_MODUL_AJAR, createFreshModulAjar } from './data/presets';
import { ModulAjarData, HariKegiatan, PaperConfig } from './types';
import { generateDocxBlob } from './utils/docxGenerator';
import { inferDefaultPrinsip, inferDefaultSintaks } from './data/learningModels';
import { validateModulAjar, scrollToAndHighlightElement } from './utils/validation';
import { PrintPaperModal } from './components/PrintPaperModal';
import { DEFAULT_PAPER_CONFIG, applyPrintPageStyle } from './utils/paperUtils';
import { Sparkles, Eye, FileEdit, CheckCircle2, ShieldCheck, AlertCircle, FileSpreadsheet, Wand2, FileText, FileDown, PlusCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function App() {
  const [formData, setFormData] = useState<ModulAjarData>(() => {
    try {
      const saved = localStorage.getItem('modul_ajar_active_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If the saved draft was just the static initial preset, start fresh so user has clean canvas
        if (
          parsed.id === 'preset-sd-fase-a' ||
          parsed.judulModul === 'SD Fase A - Aku dan Keluargaku yang Hebat'
        ) {
          localStorage.removeItem('modul_ajar_active_draft');
          return createFreshModulAjar();
        }
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
    return createFreshModulAjar();
  });

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLkpdModalOpen, setIsLkpdModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [paperConfig, setPaperConfig] = useState<PaperConfig>(() => formData.paperConfig || DEFAULT_PAPER_CONFIG);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Tersimpan otomatis');
  const [resetToast, setResetToast] = useState<string>('');

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
    if (key === 'fresh-empty') {
      handleReset();
      return;
    }
    const preset = PRESET_MODUL_AJAR[key];
    if (preset) {
      if (confirm(`Ganti data formulir dengan contoh template "${preset.judulModul}"?`)) {
        setFormData({ ...preset, updatedAt: new Date().toISOString() });
        setShowValidationErrors(false);
      }
    }
  };

  const handleReset = () => {
    const hasData = Boolean(
      formData.temaSubtema?.trim() ||
      formData.namaPenyusun?.trim() ||
      formData.materiPembelajaran?.trim() ||
      formData.namaSekolah?.trim()
    );

    if (hasData) {
      if (
        !confirm(
          'Apakah Anda yakin ingin mengosongkan seluruh formulir dan memulai modul ajar baru yang fresh? Isian saat ini akan dibersihkan.'
        )
      ) {
        return;
      }
    }

    try {
      localStorage.removeItem('modul_ajar_active_draft');
    } catch (e) {
      console.error(e);
    }

    const fresh = createFreshModulAjar();
    setFormData(fresh);
    setShowValidationErrors(false);
    setActiveTab('form');
    setResetToast('Formulir berhasil dikosongkan! Modul ajar siap diisi dalam kondisi fresh.');
    setTimeout(() => {
      setResetToast('');
    }, 4500);
  };

  const handlePaperConfigChange = (newConfig: PaperConfig) => {
    setPaperConfig(newConfig);
    applyPrintPageStyle(newConfig);
    setFormData((prev) => ({
      ...prev,
      paperConfig: newConfig,
      updatedAt: new Date().toISOString(),
    }));
  };

  const executeDownloadDocx = async (customConfig?: PaperConfig) => {
    setIsDownloading(true);
    const activeConfig = customConfig || paperConfig;
    try {
      // First attempt server-side generation with paperConfig
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paperConfig: activeConfig,
        }),
      });

      let blob: Blob;
      if (response.ok) {
        blob = await response.blob();
      } else {
        // Fallback to client-side DOCX generator with paperConfig
        console.info('Server DOCX endpoint returned non-200, using client generator fallback');
        blob = await generateDocxBlob(formData, activeConfig);
      }

      const cleanFilename = `Modul_Ajar_${(formData.temaSubtema || 'Kurikulum_Merdeka').replace(
        /[^a-zA-Z0-9_-]/g,
        '_'
      )}_${activeConfig.size}.docx`;

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
        const blob = await generateDocxBlob(formData, activeConfig);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Modul_Ajar_${(formData.temaSubtema || 'Kurikulum_Merdeka').replace(
          /[^a-zA-Z0-9_-]/g,
          '_'
        )}_${activeConfig.size}.docx`;
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
    // Open paper size modal to let user confirm A4/F4/Custom before download
    setIsPaperModalOpen(true);
  };

  const executeDownloadPdf = async (customConfig?: PaperConfig) => {
    const activeConfig = customConfig || paperConfig;
    applyPrintPageStyle(activeConfig);
    
    // Switch to preview tab so that DOM is rendered for PDF generation
    setActiveTab('preview');
    setIsDownloading(true);

    try {
      // Small timeout to allow DOM to render and images to load
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const element = document.getElementById('printable-modul-document');
      if (!element) {
        throw new Error('Elemen dokumen tidak ditemukan');
      }

      const opt = {
        margin: [0, 0, 0, 0] as [number, number, number, number],
        filename: `Modul_Ajar_${(formData.temaSubtema || 'Kurikulum_Merdeka').replace(/[^a-zA-Z0-9_-]/g, '_')}_${activeConfig.size}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { 
          unit: 'mm', 
          format: (activeConfig.size === 'F4' ? [215, 330] : activeConfig.size === 'CUSTOM' ? [activeConfig.customWidthMm || 215, activeConfig.customHeightMm || 330] : 'a4') as string | [number, number], 
          orientation: 'portrait' as const
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err: any) {
      console.error('PDF generation error:', err);
      alert('Gagal mengekspor dokumen PDF: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!validationSummary.isValid) {
      setShowValidationErrors(true);
      setValidationActionType('download');
      setIsValidationModalOpen(true);
      return;
    }
    // Set a flag or action type to pdf, but since we don't have pdf action type in paper modal, 
    // let's just execute it directly but with the currently selected paper size. 
    // Actually, letting them choose paper size is good. Let's just add pdf action type to paper modal.
    // For now, let's keep it direct since it exports preview DOM and preview DOM relies on selected paper size.
    executeDownloadPdf();
  };

  const executePrint = (customConfig?: PaperConfig) => {
    const activeConfig = customConfig || paperConfig;
    applyPrintPageStyle(activeConfig);
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
    // Open paper size modal to let user confirm A4/F4/Custom before printing
    setIsPaperModalOpen(true);
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
        onOpenPaperModal={() => setIsPaperModalOpen(true)}
        paperConfig={paperConfig}
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

        {/* Reset Confirmation Toast Banner */}
        {resetToast && (
          <div className="mb-4 flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-4 py-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300 print:hidden">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{resetToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setResetToast('')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* View Switch */}
        {activeTab === 'form' ? (
          <div className="space-y-6">
            {/* Fresh State Guidance Card */}
            {(!formData.temaSubtema?.trim() && !formData.namaPenyusun?.trim() && !formData.materiPembelajaran?.trim()) && (
              <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-indigo-100/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Kondisi Fresh: Formulir Baru Siap Diisi
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Anda berada dalam kondisi dokumen baru yang bersih. Isi kolom identitas & materi di bawah, atau manfaatkan <strong>Sihir AI</strong> untuk membuat modul secara instan.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('sd-fase-a-keluarga')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    Muat Contoh SDN 3
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shadow-2xs"
                  >
                    <Wand2 className="w-3 h-3" />
                    Sihir AI
                  </button>
                </div>
              </div>
            )}

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

            {/* AI Generator Action Block */}
            <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 rounded-xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Bantu AI: Lengkapi Seluruh Sisa Form
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Otomatis mengisi Capaian, Tujuan, Kegiatan Harian, dan Asesmen berdasarkan data di atas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Wand2 className="w-4 h-4" />
                <span>Generate dengan AI</span>
              </button>
            </div>

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
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white active:scale-98 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isDownloading ? 'Mengekspor...' : 'Unduh PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{isDownloading ? 'Mengekspor...' : 'Unduh Word'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <DocumentPreview
            data={formData}
            paperConfig={paperConfig}
            onChangePaperConfig={handlePaperConfigChange}
            onOpenPaperModal={() => setIsPaperModalOpen(true)}
            onDownloadDocx={() => executeDownloadDocx()}
            onDownloadPdf={() => executeDownloadPdf()}
            onPrint={() => executePrint()}
            onOpenLkpdGenerator={() => setIsLkpdModalOpen(true)}
            isDownloading={isDownloading}
          />
        )}
      </main>

      {/* Modals */}
      <PrintPaperModal
        isOpen={isPaperModalOpen}
        onClose={() => setIsPaperModalOpen(false)}
        paperConfig={paperConfig}
        onChangePaperConfig={handlePaperConfigChange}
        onConfirmPrint={() => executePrint()}
        onConfirmDownloadDocx={() => executeDownloadDocx()}
        onConfirmDownloadPdf={() => executeDownloadPdf()}
        hasLkpd={Boolean(formData.lkpdLengkap)}
        isDownloading={isDownloading}
      />

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
