import React from 'react';
import { X, Printer, FileDown, FileText, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';
import { PaperConfig, PaperSize } from '../types';
import { PaperSizeSelector } from './PaperSizeSelector';
import { getPaperDimensionsMm } from '../utils/paperUtils';

interface PrintPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperConfig: PaperConfig;
  onChangePaperConfig: (cfg: PaperConfig) => void;
  onConfirmPrint: () => void;
  onConfirmDownloadDocx: () => void;
  onConfirmDownloadPdf?: () => void;
  hasLkpd: boolean;
  isDownloading?: boolean;
}

export const PrintPaperModal: React.FC<PrintPaperModalProps> = ({
  isOpen,
  onClose,
  paperConfig,
  onChangePaperConfig,
  onConfirmPrint,
  onConfirmDownloadDocx,
  onConfirmDownloadPdf,
  hasLkpd,
  isDownloading = false,
}) => {
  if (!isOpen) return null;

  const { widthMm, heightMm, name } = getPaperDimensionsMm(paperConfig);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Opsi Ukuran Kertas & Cetak
              </h3>
              <p className="text-xs text-slate-500">
                Pilih ukuran kertas sebelum cetak PDF atau unduh Word
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Paper Size Selector */}
          <PaperSizeSelector
            value={paperConfig}
            onChange={onChangePaperConfig}
            compact={false}
          />

          {/* Status info box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Format Kertas Siap Diterapkan:
              </span>
              <span className="text-indigo-700 font-mono font-bold">
                {name} ({widthMm} × {heightMm} mm)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Saat mencetak di browser, ukuran halaman akan otomatis disesuaikan dengan dimensi{' '}
              <strong>{name}</strong>. File Microsoft Word (.docx) juga akan otomatis diatur ke ukuran
              kertas ini saat dibuka.
            </p>
            {hasLkpd && (
              <div className="pt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <span>✓ Dokumen menyertakan Lampiran Lembar Kerja Peserta Didik (LKPD).</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirmPrint();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Print</span>
            </button>
            
            {onConfirmDownloadPdf && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConfirmDownloadPdf();
                }}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Mengekspor...' : `Unduh PDF`}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirmDownloadDocx();
              }}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Mengekspor...' : `Unduh Word`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
