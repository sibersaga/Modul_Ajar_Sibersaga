import React, { useState } from 'react';
import { FileText, Sliders, Check, HelpCircle, RotateCw } from 'lucide-react';
import { PaperConfig, PaperSize } from '../types';
import { PAPER_PRESETS, getPaperDimensionsMm } from '../utils/paperUtils';

interface PaperSizeSelectorProps {
  value: PaperConfig;
  onChange: (newConfig: PaperConfig) => void;
  compact?: boolean;
  showCustomInputs?: boolean;
  className?: string;
}

export const PaperSizeSelector: React.FC<PaperSizeSelectorProps> = ({
  value,
  onChange,
  compact = false,
  showCustomInputs = true,
  className = '',
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState(value.size === 'CUSTOM');
  const [customWidth, setCustomWidth] = useState(value.customWidthMm || 215);
  const [customHeight, setCustomHeight] = useState(value.customHeightMm || 330);

  const handleSelectSize = (size: PaperSize) => {
    if (size === 'CUSTOM') {
      setIsCustomOpen(true);
      onChange({
        ...value,
        size: 'CUSTOM',
        customWidthMm: customWidth,
        customHeightMm: customHeight,
      });
    } else {
      setIsCustomOpen(false);
      onChange({
        ...value,
        size,
      });
    }
  };

  const handleCustomWidthChange = (w: number) => {
    setCustomWidth(w);
    onChange({
      ...value,
      size: 'CUSTOM',
      customWidthMm: w,
      customHeightMm: customHeight,
    });
  };

  const handleCustomHeightChange = (h: number) => {
    setCustomHeight(h);
    onChange({
      ...value,
      size: 'CUSTOM',
      customWidthMm: customWidth,
      customHeightMm: h,
    });
  };

  const handleOrientationToggle = () => {
    const nextOrientation = value.orientation === 'landscape' ? 'portrait' : 'landscape';
    onChange({
      ...value,
      orientation: nextOrientation,
    });
  };

  const { widthMm, heightMm, name } = getPaperDimensionsMm(value);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          Kertas:
        </span>
        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => handleSelectSize('A4')}
            className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
              value.size === 'A4'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="A4 (210 × 297 mm) - Standar Umum"
          >
            A4
          </button>
          <button
            type="button"
            onClick={() => handleSelectSize('F4')}
            className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
              value.size === 'F4'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="F4 / Folio (215 × 330 mm) - Standar Sekolah & Dinas Indonesia"
          >
            F4 / Folio
          </button>
          <button
            type="button"
            onClick={() => handleSelectSize('CUSTOM')}
            className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
              value.size === 'CUSTOM'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Ukuran Bebas / Kustom"
          >
            Kustom
          </button>
        </div>

        {value.size === 'CUSTOM' && (
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <input
              type="number"
              value={customWidth}
              onChange={(e) => handleCustomWidthChange(Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-indigo-500"
              placeholder="W"
              min={100}
              max={500}
              title="Lebar dalam mm"
            />
            <span>×</span>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => handleCustomHeightChange(Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-indigo-500"
              placeholder="H"
              min={100}
              max={600}
              title="Tinggi dalam mm"
            />
            <span className="text-[10px] text-slate-400">mm</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Format & Ukuran Kertas Dokumen</h4>
            <p className="text-[11px] text-slate-500">
              Pilih ukuran sebelum mencetak (PDF) atau mengekspor ke Word (.docx)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            Aktif: <strong className="text-slate-900">{name}</strong> ({widthMm} × {heightMm} mm)
          </span>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* A4 Card */}
        <div
          onClick={() => handleSelectSize('A4')}
          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
            value.size === 'A4'
              ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-400/20 shadow-2xs'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">A4 Standar</span>
            {value.size === 'A4' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
          </div>
          <p className="text-[11px] font-mono text-indigo-900 font-semibold">210 × 297 mm</p>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Standar umum, buku panduan & portofolio guru.
          </p>
        </div>

        {/* F4 / Folio Card */}
        <div
          onClick={() => handleSelectSize('F4')}
          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
            value.size === 'F4'
              ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-400/20 shadow-2xs'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">F4 / Folio</span>
            {value.size === 'F4' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
          </div>
          <p className="text-[11px] font-mono text-indigo-900 font-semibold">215 × 330 mm</p>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Standar HVS kantor dinas & sekolah Indonesia.
          </p>
        </div>

        {/* Custom Card */}
        <div
          onClick={() => handleSelectSize('CUSTOM')}
          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
            value.size === 'CUSTOM'
              ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-400/20 shadow-2xs'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">Kustom (Bebas)</span>
            {value.size === 'CUSTOM' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
          </div>
          <p className="text-[11px] font-mono text-indigo-900 font-semibold">
            {customWidth} × {customHeight} mm
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Sesuaikan lebar & tinggi kertas sendiri.
          </p>
        </div>
      </div>

      {/* Custom Inputs Panel (if CUSTOM is selected) */}
      {showCustomInputs && value.size === 'CUSTOM' && (
        <div className="mt-3 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Lebar (mm):</label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => handleCustomWidthChange(Math.max(50, Number(e.target.value)))}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="215"
              min={100}
              max={600}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Tinggi (mm):</label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => handleCustomHeightChange(Math.max(50, Number(e.target.value)))}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="330"
              min={100}
              max={800}
            />
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Contoh: Letter/Quarto = 215 × 280 mm | Legal = 216 × 356 mm</span>
          </div>
        </div>
      )}
    </div>
  );
};
