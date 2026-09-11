import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, X, Sparkles, FileDown } from 'lucide-react';
import { ValidationErrorItem, scrollToAndHighlightElement } from '../utils/validation';

interface ValidationAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationErrorItem[];
  onGoToField: (elementId: string) => void;
  onForceProceed?: () => void;
  title?: string;
  description?: string;
  actionType?: 'download' | 'generate' | 'print';
}

export const ValidationAlertModal: React.FC<ValidationAlertModalProps> = ({
  isOpen,
  onClose,
  errors,
  onGoToField,
  onForceProceed,
  title = 'Lengkapi Bidang Wajib Terlebih Dahulu',
  description = 'Sebelum melakukan unduhan atau cetak dokumen, mohon pastikan bidang-bidang berikut telah diisi agar format Modul Ajar sesuai dengan standar Kurikulum Merdeka:',
  actionType = 'download',
}) => {
  if (!isOpen) return null;

  // Group errors by section
  const groupedErrors: Record<string, ValidationErrorItem[]> = {};
  errors.forEach((err) => {
    if (!groupedErrors[err.sectionTitle]) {
      groupedErrors[err.sectionTitle] = [];
    }
    groupedErrors[err.sectionTitle].push(err);
  });

  const handleFixField = (elementId: string) => {
    onClose();
    onGoToField(elementId);
  };

  const handleFixFirst = () => {
    if (errors.length > 0) {
      handleFixField(errors[0].elementId);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4.5 bg-rose-50 border-b border-rose-100">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-xs flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-rose-700 font-medium mt-0.5">
                Terdapat {errors.length} bidang wajib yang masih kosong
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

          <div className="space-y-3.5">
            {Object.entries(groupedErrors).map(([sectionTitle, items]) => (
              <div
                key={sectionTitle}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2"
              >
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {sectionTitle}
                </h4>
                <div className="space-y-1.5 pl-3.5">
                  {items.map((err) => (
                    <div
                      key={err.field}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="pr-2">
                        <span className="font-semibold text-slate-700">{err.label}</span>
                        <p className="text-[11px] text-rose-600">{err.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFixField(err.elementId)}
                        className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Isi</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onForceProceed ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onForceProceed();
              }}
              className="text-xs text-slate-500 hover:text-slate-700 underline font-medium cursor-pointer"
            >
              Tetap {actionType === 'download' ? 'Unduh' : 'Lanjutkan'} Saja
            </button>
          ) : (
            <span className="text-xs text-slate-400">Pastikan seluruh data akurat</span>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleFixFirst}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Lengkapi Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
