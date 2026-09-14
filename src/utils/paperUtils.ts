import { PaperConfig, PaperSize } from '../types';

export interface PaperSizeDetail {
  id: PaperSize;
  name: string;
  label: string;
  widthMm: number;
  heightMm: number;
  widthDxa: number;
  heightDxa: number;
  aspectRatio: string;
  description: string;
}

export const PAPER_PRESETS: Record<PaperSize, PaperSizeDetail> = {
  A4: {
    id: 'A4',
    name: 'A4',
    label: 'A4 (210 × 297 mm)',
    widthMm: 210,
    heightMm: 297,
    widthDxa: 11906, // 210 * 56.6929
    heightDxa: 16838, // 297 * 56.6929
    aspectRatio: '210/297',
    description: 'Standar Internasional & Buku Pedoman Guru',
  },
  F4: {
    id: 'F4',
    name: 'F4 / Folio',
    label: 'F4 / Folio (215 × 330 mm)',
    widthMm: 215,
    heightMm: 330,
    widthDxa: 12189, // 215 * 56.6929
    heightDxa: 18709, // 330 * 56.6929
    aspectRatio: '215/330',
    description: 'Standar Kertas HVS Dinas & Sekolah di Indonesia',
  },
  CUSTOM: {
    id: 'CUSTOM',
    name: 'Kustom',
    label: 'Kustom (Ukuran Bebas)',
    widthMm: 215,
    heightMm: 330,
    widthDxa: 12189,
    heightDxa: 18709,
    aspectRatio: '215/330',
    description: 'Tentukan ukuran lebar & tinggi kertas sesuai kebutuhan Anda',
  },
};

export const DEFAULT_PAPER_CONFIG: PaperConfig = {
  size: 'A4',
  customWidthMm: 215,
  customHeightMm: 330,
  orientation: 'portrait',
};

/**
 * Returns the effective width and height in mm
 */
export function getPaperDimensionsMm(config: PaperConfig = DEFAULT_PAPER_CONFIG): {
  widthMm: number;
  heightMm: number;
  name: string;
} {
  if (config.size === 'CUSTOM') {
    const w = config.customWidthMm && config.customWidthMm > 50 ? config.customWidthMm : 215;
    const h = config.customHeightMm && config.customHeightMm > 50 ? config.customHeightMm : 330;
    return {
      widthMm: config.orientation === 'landscape' ? Math.max(w, h) : Math.min(w, h),
      heightMm: config.orientation === 'landscape' ? Math.min(w, h) : Math.max(w, h),
      name: `Kustom (${w} × ${h} mm)`,
    };
  }

  const preset = PAPER_PRESETS[config.size] || PAPER_PRESETS.A4;
  if (config.orientation === 'landscape') {
    return {
      widthMm: preset.heightMm,
      heightMm: preset.widthMm,
      name: `${preset.name} (Landscape)`,
    };
  }

  return {
    widthMm: preset.widthMm,
    heightMm: preset.heightMm,
    name: preset.name,
  };
}

/**
 * Returns the DXA dimensions for Word (.docx) generation
 */
export function getPaperDimensionsDxa(config: PaperConfig = DEFAULT_PAPER_CONFIG): {
  widthDxa: number;
  heightDxa: number;
} {
  const { widthMm, heightMm } = getPaperDimensionsMm(config);
  return {
    widthDxa: Math.round(widthMm * 56.6929),
    heightDxa: Math.round(heightMm * 56.6929),
  };
}

/**
 * Dynamically applies the @page CSS rule for browser print preview
 */
export function applyPrintPageStyle(config: PaperConfig = DEFAULT_PAPER_CONFIG): void {
  if (typeof document === 'undefined') return;

  const { widthMm, heightMm } = getPaperDimensionsMm(config);
  const styleId = 'dynamic-paper-print-style';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.innerHTML = `
    @media print {
      @page {
        size: ${widthMm}mm ${heightMm}mm !important;
        margin: 15mm 15mm 15mm 15mm !important;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .page-break-avoid, tr, .avoid-break {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      .page-break-before {
        break-before: page !important;
        page-break-before: always !important;
      }
    }
  `;
}
