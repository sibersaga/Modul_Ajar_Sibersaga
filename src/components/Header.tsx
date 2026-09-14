import React from 'react';
import {
  Sparkles,
  FileDown,
  Printer,
  FolderArchive,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Wand2,
  FileSpreadsheet,
  Sliders,
  FilePlus2
} from 'lucide-react';
import { PRESET_MODUL_AJAR } from '../data/presets';
import { ModulAjarData, PaperConfig } from '../types';

interface HeaderProps {
  onLoadPreset: (presetKey: string) => void;
  onReset: () => void;
  onOpenAiGenerator: () => void;
  onOpenLkpdGenerator: () => void;
  onOpenSavedModal: () => void;
  onOpenPaperModal?: () => void;
  paperConfig?: PaperConfig;
  onDownloadDocx: () => void;
  onPrint: () => void;
  activeTab: 'form' | 'preview';
  setActiveTab: (tab: 'form' | 'preview') => void;
  formData: ModulAjarData;
  isDownloading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadPreset,
  onReset,
  onOpenAiGenerator,
  onOpenLkpdGenerator,
  onOpenSavedModal,
  onOpenPaperModal,
  paperConfig,
  onDownloadDocx,
  onPrint,
  activeTab,
  setActiveTab,
  formData,
  isDownloading,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Modul Ajar Generator
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Kurikulum Merdeka
                </span>
                <span className="hidden md:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Deep Learning
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {formData.namaSekolah ? `${formData.namaSekolah} • ` : ''}
                Fase {formData.fase} ({formData.kelas}) • {formData.temaSubtema || 'Modul Pembelajaran'}
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                id="tab-edit-form-btn"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Formulir Modul
              </button>
              <button
                type="button"
                id="tab-live-preview-btn"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pratinjau Dokumen
              </button>
            </div>

            {/* New / Reset Module Button */}
            <button
              type="button"
              id="header-new-fresh-module-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-2xs hover:border-slate-400 active:scale-98 transition-all cursor-pointer"
              title="Buat modul ajar baru dengan formulir kosong (kondisi fresh)"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Modul Baru (Kosong)</span>
            </button>

            {/* Template Preset Dropdown */}
            <div className="relative inline-block text-left">
              <select
                id="preset-selector-dropdown"
                onChange={(e) => {
                  if (e.target.value) {
                    onLoadPreset(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                title="Pilih contoh modul ajar siap pakai atau formulir baru"
              >
                <option value="" disabled>
                  Contoh Template...
                </option>
                <option value="fresh-empty">✨ Formulir Baru (Kosong & Fresh)</option>
                <option value="sd-fase-a-keluarga">SD Fase A - Aku & Keluargaku (SDN 3 Purwosari)</option>
                <option value="paud-fase-fondasi-diriku">PAUD Fase Fondasi - Diriku & Teman Baru</option>
              </select>
            </div>

            {/* AI Generator Magic Button */}
            <button
              type="button"
              id="ai-generate-full-module-trigger-btn"
              onClick={onOpenAiGenerator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-sm hover:from-amber-600 hover:to-orange-600 active:scale-98 transition-all cursor-pointer"
              title="Buat seluruh modul ajar secara otomatis dengan AI"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Sihir AI</span>
            </button>

            {/* Buat LKPD Otomatis Button */}
            <button
              type="button"
              id="header-create-lkpd-btn"
              onClick={onOpenLkpdGenerator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-lg shadow-sm transition-all cursor-pointer"
              title="Buat Lembar Kerja Peserta Didik (LKPD) otomatis dari data Modul Ajar"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Buat LKPD</span>
            </button>

            {/* Saved Modules Modal */}
            <button
              type="button"
              id="saved-modules-trigger-btn"
              onClick={onOpenSavedModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer"
              title="Kelola arsip modul tersimpan"
            >
              <FolderArchive className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Arsip Saya</span>
            </button>

            {/* Paper Size Setting Modal Trigger */}
            {onOpenPaperModal && (
              <button
                type="button"
                id="header-paper-size-btn"
                onClick={onOpenPaperModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer"
                title="Atur ukuran kertas cetak & dokumen Word (A4 / F4 / Kustom)"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kertas: <strong className="text-slate-900">{paperConfig?.size || 'A4'}</strong></span>
              </button>
            )}

            {/* Print button */}
            <button
              type="button"
              id="print-document-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer"
              title="Cetak atau simpan ke PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* Download DOCX */}
            <button
              type="button"
              id="download-docx-top-btn"
              onClick={onDownloadDocx}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              title="Download file Microsoft Word (.docx)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Mengunduh...' : 'Unduh Word (.docx)'}</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              id="reset-form-btn"
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              title="Bersihkan formulir"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
