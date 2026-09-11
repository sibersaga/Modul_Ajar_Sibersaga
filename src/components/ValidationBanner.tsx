import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { ValidationSummary } from '../utils/validation';

interface ValidationBannerProps {
  summary: ValidationSummary;
  showErrors: boolean;
  onGoToField: (elementId: string) => void;
  onOpenValidationModal: () => void;
}

export const ValidationBanner: React.FC<ValidationBannerProps> = ({
  summary,
  showErrors,
  onGoToField,
  onOpenValidationModal,
}) => {
  const { isValid, errors, completedCount, totalRequired, percentComplete } = summary;

  return (
    <div className="mb-6 space-y-3">
      {/* Interactive Progress & Status Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
              isValid
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : percentComplete >= 75
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {percentComplete}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900">
                Kelengkapan Modul Ajar: {completedCount} dari {totalRequired} Bidang Wajib
              </h3>
              {isValid ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Siap Unduh
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertCircle className="w-3 h-3" /> {errors.length} Bidang Perlu Dilengkapi
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {isValid
                ? 'Seluruh komponen penting telah lengkap. Anda dapat mengunduh berkas Word (.docx) atau mencetak langsung.'
                : 'Bidang bertanda bintang (*) wajib diisi agar modul memenuhi format baku Kurikulum Merdeka.'}
            </p>
          </div>
        </div>

        {/* Progress Bar & Detail Action */}
        <div className="flex items-center gap-3 md:w-64 flex-shrink-0">
          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isValid
                  ? 'bg-emerald-500'
                  : percentComplete >= 75
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          {!isValid && (
            <button
              type="button"
              onClick={onOpenValidationModal}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline whitespace-nowrap cursor-pointer"
            >
              Lihat Daftar
            </button>
          )}
        </div>
      </div>

      {/* Prominent Warning Banner if user attempted an action and there are missing fields */}
      {showErrors && !isValid && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl border-y border-r border-rose-200 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">
                  Perhatian: {errors.length} bidang wajib belum diisi
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Mohon lengkapi data yang ditandai merah di bawah ini sebelum melanjutkan unduh atau cetak.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pl-7 sm:pl-0">
              {errors.slice(0, 3).map((err) => (
                <button
                  key={err.field}
                  type="button"
                  onClick={() => onGoToField(err.elementId)}
                  className="text-[11px] font-semibold px-2 py-1 rounded-md bg-white text-rose-800 border border-rose-300 hover:bg-rose-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  title={`Lompat ke ${err.label}`}
                >
                  <span>{err.label.split('(')[0].trim()}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              ))}
              {errors.length > 3 && (
                <button
                  type="button"
                  onClick={onOpenValidationModal}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline px-1 cursor-pointer"
                >
                  +{errors.length - 3} lainnya
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
