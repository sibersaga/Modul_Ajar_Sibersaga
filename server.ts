import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  Packer,
  Header,
  Footer,
} from 'docx';

dotenv.config();

const rootDir = process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi di environment atau Secrets.');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Resilient fallback runner for Gemini model calls
async function generateWithFallback(ai: GoogleGenAI, options: { contents: any; config?: any }) {
  const models = ['gemini-3.6-flash', 'gemini-3.8-flash'];
  let lastError: any = null;
  for (const model of models) {
    try {
      const resp = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return resp;
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying alternative:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiKeyAvailable: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Autofill for individual field
app.post('/api/ai/autofill', async (req: Request, res: Response) => {
  try {
    const { field, text, context } = req.body;
    if (!field) {
      return res.status(400).json({ status: 400, message: 'Parameter "field" wajib diisi' });
    }

    const ai = getGenAI();

    const systemInstruction = `Anda adalah asisten kurikulum ahli Kurikulum Merdeka (Kemendikbudristek RI) dan praktisi pembelajaran mendalam (Deep Learning: Mindful, Meaningful, Joyful) untuk jenjang PAUD, SD, SMP, SMA.
Tugas Anda: Menghasilkan atau menyempurnakan teks spesifik untuk bagian formulir "${field}" yang langsung siap ditempatkan ke dalam dokumen Modul Ajar resmi.
Pedoman penulisan:
1. Bahasa Indonesia baku, profesional, bernuansa pedagogis, lugas dan mendalam.
2. Jangan memberikan instruksi balik kepada guru (seperti "Buatlah...", "Tuliskan...").
3. Jangan menyertakan kata pengantar seperti "Berikut adalah...", "Tentu...", atau tanda kutip pembungkus.
4. Sesuaikan konten dengan fase/jenjang yang diberikan di konteks.`;

    const userPrompt = `Field yang diminta: "${field}"
Konteks teks input saat ini: "${text || ''}"
Konteks Dokumen:
- Satuan Pendidikan: ${context?.namaSekolah || 'SDN 3 Purwosari'}
- Jenjang & Fase: ${context?.jenjang || 'SD'} / Fase ${context?.fase || 'A'} (${context?.kelas || 'Kelas 1'})
- Tema / Subtema: ${context?.temaSubtema || 'Lingkungan Sekolah'}
- Alokasi Waktu: ${context?.alokasiWaktu || '5 x 3 JP'}
- Model Pembelajaran: ${context?.modelPembelajaran || 'Problem Based Learning'}
- Karakteristik Siswa: ${context?.identifikasiPesertaDidik || ''}

Tuliskan konten hasil akhir yang disempurnakan secara langsung:`;

    const response = await generateWithFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const resultText = response.text ? response.text.trim() : '';
    return res.json({ status: 200, data: resultText });
  } catch (error: any) {
    console.error('Error in /api/ai/autofill:', error);
    return res.status(500).json({
      status: 500,
      message: error.message || 'Gagal menghasilkan konten AI',
    });
  }
});

// AI Generate LKPD from prompt
app.post('/api/ai/generate-lkpd', async (req: Request, res: Response) => {
  try {
    const { prompt, modulContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ status: 400, message: 'Parameter "prompt" wajib diisi' });
    }

    const ai = getGenAI();
    const systemInstruction = `Anda adalah ahli pengembang bahan ajar dan Lembar Kerja Peserta Didik (LKPD) Kurikulum Merdeka Kemendikbudristek RI serta praktisi Pembelajaran Mendalam (Deep Learning: Mindful, Meaningful, Joyful).
Tugas Anda: Menghasilkan Lembar Kerja Peserta Didik (LKPD) yang kontekstual, menarik, aktif, dan siap cetak langsung digunakan oleh peserta didik di kelas.
Pedoman Penulisan:
1. Format teks rapi dan terstruktur dengan penomoran yang jelas.
2. Gunakan bahasa Indonesia baku namun ramah dan mudah dipahami sesuai tahap perkembangan peserta didik.
3. Jangan memberikan kata pengantar seperti "Tentu...", "Berikut adalah LKPD...", langsung sajikan dokumen LKPD dari judul/kop dokumen.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const resultText = response.text ? response.text.trim() : '';
    return res.json({ status: 200, data: resultText });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-lkpd:', error);
    return res.status(500).json({
      status: 500,
      message: error.message || 'Gagal menghasilkan LKPD dengan AI',
    });
  }
});

// AI Generate Full Modul Ajar
app.post('/api/ai/generate-full-modul', async (req: Request, res: Response) => {
  try {
    const { credentials, fokusPembelajaran, generateLKPD } = req.body;
    const ai = getGenAI();

    let lkpdInstruction = '';
    let lkpdField = '';
    
    if (generateLKPD) {
      lkpdInstruction = `
Selain itu, buatkan LKPD yang komprehensif berdasarkan prompt berikut:
Bertindaklah sebagai guru ${credentials.jenjang || 'SD'} yang kreatif. Buatkan saya isi LKPD yang menarik, aktif, dan sesuai dengan usia siswa.
Mata pelajaran: ${credentials.temaSubtema || 'Sesuai dengan modul'}
Kelas: ${credentials.kelas || 'Sesuai jenjang'}
Materi: Sesuai dengan materi pembelajaran modul ini
Tujuan pembelajaran: Sesuai dengan tujuan pembelajaran modul ini
Buatkan LKPD yang terdiri dari:
- Judul kegiatan
- Tujuan kegiatan
- Petunjuk pengerjaan yang singkat dan mudah dipahami
- Kegiatan utama yang membuat siswa aktif
- Minimal 5 soal atau tugas
- Refleksi sederhana untuk siswa
- Kunci jawaban
Sesuaikan bahasa, tingkat kesulitan, dan aktivitas dengan karakteristik siswa kelas ${credentials.kelas || 'Sesuai jenjang'}. Buat kegiatan yang bisa digunakan langsung di kelas.
Pastikan LKPD ditulis dalam bentuk Markdown atau teks terstruktur ke dalam field "lkpdLengkap".`;
      lkpdField = `\n  "lkpdLengkap": "...",`;
    }

    const prompt = `Anda adalah konsultan ahli Kurikulum Merdeka dan pendekatan Pembelajaran Mendalam (Deep Learning: Mindful/Berkesadaran, Meaningful/Bermakna, Joyful/Menggembirakan).
Berdasarkan data awal berikut:
- Satuan Pendidikan: ${credentials.namaSekolah || 'SDN 3 Purwosari'}
- Nama Penyusun: ${credentials.namaPenyusun || 'Guru Kelas'}
- Jenjang: ${credentials.jenjang || 'SD'}
- Fase: ${credentials.fase || 'A'}
- Kelas: ${credentials.kelas || 'Kelas 1'}
- Semester: ${credentials.semester || 1}
- Bulan: ${credentials.bulan || 'Agustus'}
- Minggu ke: ${credentials.mingguKe || 2}
- Alokasi Waktu: ${credentials.alokasiWaktu || '5 x 3 JP'} (Total 5 Hari, 3 JP per hari)
- Tema/Subtema yang diinginkan: ${credentials.temaSubtema || 'Aku dan Lingkungan Sekitarku'}
- Fokus Khusus: ${fokusPembelajaran || 'Pengembangan literasi, karakter gotong royong, dan kemandirian'}
${lkpdInstruction}

TUGAS: Hasilkan Modul Ajar lengkap dan bermutu tinggi dalam format JSON murni.
JSON HARUS memiliki struktur persis sebagai berikut:
{
  "temaSubtema": "...",
  "elemenCp": "...",
  "dimensiProfilLulusan": ["Keimanan dan Ketakwaan terhadap Tuhan YME", "Penalaran Kritis", "Kolaborasi / Gotong Royong", "Kemandirian", "Kreativitas", "Komunikasi"],
  "identifikasiPesertaDidik": "...",
  "materiPembelajaran": "...",
  "tujuanPembelajaran": "...",
  "topikPembelajaran": "...",
  "desainPembelajaranLintasDisiplinIlmu": "...",
  "desainPembelajaranPraktikPedagogis": "...",
  "desainPembelajaranKemitraanPembelajaran": ["..."],
  "desainPembelajaranLingkunganPembelajaran": ["..."],
  "desainPembelajaranPemanfaatanDigital": ["..."],
  "rencanaPelaksanaanAwal": [
    "Salam, doa bersama, dan presensi ceria",
    "Apersepsi dan lagu pemantik semangat",
    "Pertanyaan pemantik bermakna..."
  ],
  "rencanaPelaksanaanInti": "Deskripsi singkat pendekatan deep learning...",
  "kegiatanHarian": [
    {
      "hari": 1,
      "tahap": "MEMAHAMI",
      "kegiatan": [
        {
          "jp": 1,
          "judul": "...",
          "prinsipDeepLearning": "Bermakna (Meaningful Learning) atau Berkesadaran (Mindful Learning) atau Menggembirakan (Joyful Learning)",
          "sintaksModel": "Sintaks tahap model yang relevan (misal Tahap 1: Orientasi masalah kontekstual)",
          "dimensi": "...",
          "alatBahan": "...",
          "deskripsi": "...",
          "langkah": ["...", "..."]
        },
        {
          "jp": 2,
          "judul": "...",
          "dimensi": "...",
          "alatBahan": "...",
          "deskripsi": "...",
          "langkah": ["...", "..."]
        },
        {
          "jp": 3,
          "judul": "...",
          "dimensi": "...",
          "alatBahan": "...",
          "deskripsi": "...",
          "langkah": ["...", "..."]
        }
      ]
    },
    {
      "hari": 2,
      "tahap": "MEMAHAMI",
      "kegiatan": [...]
    },
    {
      "hari": 3,
      "tahap": "MENGAPLIKASI",
      "kegiatan": [...]
    },
    {
      "hari": 4,
      "tahap": "MENGAPLIKASI",
      "kegiatan": [...]
    },
    {
      "hari": 5,
      "tahap": "MEREFLEKSI",
      "kegiatan": [...]
    }
  ],
  "rencanaPelaksanaanPenutup": [
    "Refleksi bersama siswa mengenai perasaan dan hal bermakna yang didapatkan",
    "Pemberian apresiasi penguatan positif",
    "Doa penutup dan salam ceria"
  ],
  "asesmenPembelajaranAwal": "...",
  "asesmenPembelajaranProses": "...",
  "asesmenPembelajaranAkhir": "...",
  "lembarKerjaSiswa": "...",
  "rubrikPenilaian": "..."${lkpdField}
}

KEMBALIKAN HANYA JSON MURNI TANPA BACKTICK MARKDOWN ATAU PENJELASAN LAIN.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text?.trim() || '{}';
    let cleanJson = responseText;
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleanJson);
    return res.json({ status: 200, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-full-modul:', error);
    return res.status(500).json({
      status: 500,
      message: error.message || 'Gagal menghasilkan modul ajar lengkap',
    });
  }
});

// Server-side DOCX generation endpoint
app.post('/api/generate-docx', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ status: 400, message: 'Data formulir tidak boleh kosong' });
    }

    const tableBorderSolid = {
      top: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
      left: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
      right: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
    };

    const tableBorderNone = {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    };

    const cellMargins = { top: 120, bottom: 120, left: 160, right: 160 };

    const createHeadingPara = (text: string, level: number = 1) => {
      return new Paragraph({
        heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text,
            bold: true,
            color: level === 1 ? '1E3A8A' : '0F172A',
            size: level === 1 ? 26 : 22,
          }),
        ],
      });
    };

    const createKeyValueRow = (key: string, value: any) => {
      const valText = Array.isArray(value) ? value.join('\n• ') : (value || '-');
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: key, bold: true, size: 20 })] })],
          }),
          new TableCell({
            width: { size: 6500, type: WidthType.DXA },
            margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: Array.isArray(value) ? `• ${valText}` : valText, size: 20 })] })],
          }),
        ],
      });
    };

    const kegiatanRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 1400, type: WidthType.DXA },
            shading: { fill: 'F1F5F9' },
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hari / Tahap', bold: true, size: 20 })] })],
          }),
          new TableCell({
            width: { size: 8100, type: WidthType.DXA },
            shading: { fill: 'F1F5F9' },
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: 'Uraian Kegiatan Pembelajaran Mendalam (Deep Learning)', bold: true, size: 20 })] })],
          }),
        ],
      }),
    ];

    if (Array.isArray(data.kegiatanHarian)) {
      data.kegiatanHarian.forEach((hari: any) => {
        const paras: Paragraph[] = [
          new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({ text: `Tahap: ${hari.tahap || 'MEMAHAMI'}`, bold: true, color: '2563EB', size: 20 })],
          }),
        ];

        if (Array.isArray(hari.kegiatan)) {
          hari.kegiatan.forEach((keg: any, idx: number) => {
            paras.push(
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [new TextRun({ text: `Kegiatan ${idx + 1} (JP ${keg.jp || idx + 1}): ${keg.judul || ''}`, bold: true, size: 20 })],
              })
            );
            if (keg.prinsipDeepLearning) {
              paras.push(
                new Paragraph({
                  spacing: { after: 30 },
                  children: [
                    new TextRun({ text: '• Prinsip Deep Learning: ', bold: true, color: '047857', size: 18 }),
                    new TextRun({ text: keg.prinsipDeepLearning, italics: true, size: 18 }),
                  ],
                })
              );
            }
            if (keg.sintaksModel) {
              paras.push(
                new Paragraph({
                  spacing: { after: 30 },
                  children: [
                    new TextRun({ text: '• Sintaks Model: ', bold: true, color: '0369A1', size: 18 }),
                    new TextRun({ text: keg.sintaksModel, size: 18 }),
                  ],
                })
              );
            }
            if (keg.dimensi) {
              paras.push(
                new Paragraph({
                  spacing: { after: 30 },
                  children: [
                    new TextRun({ text: 'Dimensi: ', bold: true, italics: true, size: 18 }),
                    new TextRun({ text: keg.dimensi, italics: true, size: 18 }),
                  ],
                })
              );
            }
            if (keg.alatBahan) {
              paras.push(
                new Paragraph({
                  spacing: { after: 30 },
                  children: [
                    new TextRun({ text: 'Alat & Bahan: ', bold: true, size: 18 }),
                    new TextRun({ text: keg.alatBahan, size: 18 }),
                  ],
                })
              );
            }
            if (keg.deskripsi) {
              paras.push(
                new Paragraph({
                  spacing: { after: 40 },
                  children: [new TextRun({ text: keg.deskripsi, size: 19 })],
                })
              );
            }
            if (Array.isArray(keg.langkah)) {
              keg.langkah.forEach((langkahItem: string, lIdx: number) => {
                paras.push(
                  new Paragraph({
                    spacing: { after: 20 },
                    bullet: { level: 0 },
                    children: [new TextRun({ text: `${lIdx + 1}. ${langkahItem}`, size: 18 })],
                  })
                );
              });
            }
          });
        }

        kegiatanRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 1400, type: WidthType.DXA },
                margins: cellMargins,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: `Hari ${hari.hari}`, bold: true, size: 22 }),
                      new TextRun({ text: `\n(${hari.tahap})`, size: 18, color: '475569' }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 8100, type: WidthType.DXA },
                margins: cellMargins,
                children: paras,
              }),
            ],
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: `Modul Ajar Kurikulum Merdeka - ${data.namaSekolah || 'Satuan Pendidikan'}`, size: 16, color: '94A3B8' })],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `Penyusun: ${data.namaPenyusun || 'Guru'} | Deep Learning`, size: 16, color: '94A3B8' })],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
              children: [new TextRun({ text: 'MODUL AJAR KURIKULUM MERDEKA', bold: true, size: 32, color: '1E3A8A' })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
              children: [new TextRun({ text: 'PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)', bold: true, size: 22, color: '0369A1' })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
              children: [new TextRun({ text: `Fase ${data.fase} - ${data.kelas} | ${data.namaSekolah || 'Satuan Pendidikan'}`, italics: true, size: 20 })],
            }),

            createHeadingPara('A. INFORMASI UMUM & IDENTITAS DOKUMEN', 1),
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderSolid,
              rows: [
                createKeyValueRow('Satuan Pendidikan', data.namaSekolah),
                createKeyValueRow('Nama Penyusun', data.namaPenyusun),
                createKeyValueRow('NIP', data.nip || '-'),
                createKeyValueRow('Jenjang / Fase / Kelas', `${data.jenjang} / Fase ${data.fase} / ${data.kelas}`),
                createKeyValueRow('Semester / Bulan / Minggu', `Semester ${data.semester} / Bulan ${data.bulan} / Minggu ke-${data.mingguKe}`),
                createKeyValueRow('Alokasi Waktu', data.alokasiWaktu),
                createKeyValueRow('Jumlah Peserta Didik', data.jumlahAnak ? `${data.jumlahAnak} Anak` : '-'),
                createKeyValueRow('Model Pembelajaran', data.modelPembelajaran),
                createKeyValueRow('Tema / Subtema', data.temaSubtema),
              ],
            }),

            createHeadingPara('B. IDENTIFIKASI PEMBELAJARAN', 1),
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderSolid,
              rows: [
                createKeyValueRow('Karakteristik Peserta Didik', data.identifikasiPesertaDidik),
                createKeyValueRow('Materi Pembelajaran', data.materiPembelajaran),
                createKeyValueRow('Dimensi Profil Lulusan / P3', data.dimensiProfilLulusan),
              ],
            }),

            createHeadingPara('C. DESAIN PEMBELAJARAN', 1),
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderSolid,
              rows: [
                createKeyValueRow('Capaian Pembelajaran (CP)', data.elemenCp),
                createKeyValueRow('Tujuan Pembelajaran (TP)', data.tujuanPembelajaran),
                createKeyValueRow('Topik Pembelajaran', data.topikPembelajaran),
                createKeyValueRow('Lintas Disiplin Ilmu', data.desainPembelajaranLintasDisiplinIlmu),
                createKeyValueRow('Praktik Pedagogis (3 Pilar)', data.desainPembelajaranPraktikPedagogis),
                createKeyValueRow('Kemitraan Pembelajaran', data.desainPembelajaranKemitraanPembelajaran),
                createKeyValueRow('Lingkungan Pembelajaran', data.desainPembelajaranLingkunganPembelajaran),
                createKeyValueRow('Pemanfaatan Digital', data.desainPembelajaranPemanfaatanDigital),
              ],
            }),

            createHeadingPara('D. RENCANA PELAKSANAAN PEMBELAJARAN', 1),
            new Paragraph({
              spacing: { before: 120, after: 60 },
              children: [new TextRun({ text: '1. Kegiatan Awal (Berkesadaran, Bermakna, Menggembirakan)', bold: true, size: 22 })],
            }),
            ...(Array.isArray(data.rencanaPelaksanaanAwal) ? data.rencanaPelaksanaanAwal : []).map(
              (item: string) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 40 },
                  children: [new TextRun({ text: item, size: 20 })],
                })
            ),

            new Paragraph({
              spacing: { before: 180, after: 80 },
              children: [new TextRun({ text: '2. Kegiatan Inti Pembelajaran (Memahami, Mengaplikasi, Merefleksi)', bold: true, size: 22 })],
            }),
            new Paragraph({
              spacing: { after: 120 },
              children: [new TextRun({ text: data.rencanaPelaksanaanInti || '', size: 20 })],
            }),
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderSolid,
              rows: kegiatanRows,
            }),

            new Paragraph({
              spacing: { before: 180, after: 60 },
              children: [new TextRun({ text: '3. Kegiatan Penutup (Berkesadaran, Menggembirakan)', bold: true, size: 22 })],
            }),
            ...(Array.isArray(data.rencanaPelaksanaanPenutup) ? data.rencanaPelaksanaanPenutup : []).map(
              (item: string) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 40 },
                  children: [new TextRun({ text: item, size: 20 })],
                })
            ),

            createHeadingPara('E. ASESMEN PEMBELAJARAN & EVALUASI', 1),
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderSolid,
              rows: [
                createKeyValueRow('Asesmen Awal (Diagnostik)', data.asesmenPembelajaranAwal),
                createKeyValueRow('Asesmen Proses (Formatif)', data.asesmenPembelajaranProses),
                createKeyValueRow('Asesmen Akhir (Sumatif)', data.asesmenPembelajaranAkhir),
                createKeyValueRow('Lembar Kerja Peserta Didik (LKPD)', data.lembarKerjaSiswa),
                createKeyValueRow('Rubrik Penilaian & Kriteria', data.rubrikPenilaian),
              ],
            }),

            new Paragraph({ spacing: { before: 360, after: 120 }, children: [] }),
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderNone,
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 4750, type: WidthType.DXA },
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mengetahui,', size: 20 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kepala Sekolah', size: 20 })] }),
                        new Paragraph({ spacing: { before: 900 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: `( ${data.namaKepalaSekolah || '______________________________'} )`, bold: true, size: 20 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.nipKepalaSekolah ? `NIP. ${data.nipKepalaSekolah}` : 'NIP. .................................................', size: 18 })] }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 4750, type: WidthType.DXA },
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Ditetapkan di: ........................, ${data.bulan || 'Agustus'} ${new Date().getFullYear()}`, size: 20 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Guru / Penyusun Modul,', size: 20 })] }),
                        new Paragraph({ spacing: { before: 900 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: `( ${data.namaPenyusun || '______________________________'} )`, bold: true, size: 20 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.nip ? `NIP. ${data.nip}` : 'NIP. .................................................', size: 18 })] }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
        // LKPD Page (if exists)
        ...(data.lkpdLengkap ? [{
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 60 },
              children: [
                new TextRun({
                  text: 'LEMBAR KERJA PESERTA DIDIK (LKPD)',
                  bold: true,
                  size: 28,
                  color: '047857',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: 'KURIKULUM MERDEKA • PEMBELAJARAN MENDALAM (DEEP LEARNING)',
                  bold: true,
                  size: 20,
                  color: '334155',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
              children: [
                new TextRun({
                  text: `${data.namaSekolah || 'SDN 3 Purwosari'} • Topik: ${data.topikPembelajaran || data.temaSubtema}`,
                  size: 18,
                  color: '64748B',
                }),
              ],
            }),

            // Identitas Siswa Table
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderSolid,
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 5500, type: WidthType.DXA },
                      margins: cellMargins,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: 'Nama Siswa/Kelompok : .....................................................', size: 19 })] }),
                        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Kelas / Fase              : ${data.kelas || 'Kelas 1'} (Fase ${data.fase || 'A'})`, size: 19, bold: true })] }),
                        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Nomor Absen             : .....................................................', size: 19 })] }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 4000, type: WidthType.DXA },
                      margins: cellMargins,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: 'Hari / Tanggal : .........................................', size: 19 })] }),
                        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Alokasi Waktu  : ${data.alokasiWaktu || '2 x 35 Menit'}`, size: 19 })] }),
                        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Nilai & Paraf  : [                             ]', size: 19, bold: true })] }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            // Box Infografis Alur Belajar Deep Learning
            new Paragraph({ spacing: { before: 180, after: 60 }, children: [] }),
            new Table({
              width: { size: 9500, type: WidthType.DXA },
              borders: tableBorderSolid,
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 9500, type: WidthType.DXA },
                      shading: { fill: 'ECFDF5' },
                      margins: cellMargins,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: '★ INFOGRAFIS ALUR BELAJAR DEEP LEARNING (MINDFUL, MEANINGFUL, JOYFUL):', bold: true, size: 20, color: '065F46' }),
                          ],
                        }),
                        new Paragraph({
                          spacing: { before: 80 },
                          children: [
                            new TextRun({ text: '1. Amati & Sadari (Mindful): ', bold: true, size: 18, color: '047857' }),
                            new TextRun({ text: 'Mencermati stimulus dan fenomena sekitar dengan rasa ingin tahu tinggi.\n', size: 18 }),
                            new TextRun({ text: '2. Jelajahi Konsep (Meaningful): ', bold: true, size: 18, color: '0369A1' }),
                            new TextRun({ text: 'Mendiskusikan ide bersama teman & mengaitkan ilmu dengan pengalaman nyata.\n', size: 18 }),
                            new TextRun({ text: '3. Bernalar & Kreasi (Joyful): ', bold: true, size: 18, color: 'B45309' }),
                            new TextRun({ text: 'Menyelesaikan tantangan berpikir kritis dan menuangkan karya orisinal.\n', size: 18 }),
                            new TextRun({ text: '4. Refleksi & Aksi: ', bold: true, size: 18, color: 'BE123C' }),
                            new TextRun({ text: 'Mengungkapkan perasaan dan menerapkan nilai positif dalam keseharian.', size: 18 }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

            // Parsed LKPD Content
            ...data.lkpdLengkap.split('\n').map((line: string) => {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---')) {
                return new Paragraph({ spacing: { before: 60, after: 60 }, children: [] });
              }

              const isSectionHeading = trimmed.match(/^[A-H]\.\s/);
              const isTaskHeading = trimmed.toUpperCase().startsWith('TUGAS') || trimmed.toUpperCase().startsWith('SOAL');

              if (isSectionHeading) {
                return new Paragraph({
                  spacing: { before: 240, after: 100 },
                  children: [
                    new TextRun({
                      text: trimmed,
                      bold: true,
                      size: 22,
                      color: '047857',
                    }),
                  ],
                });
              }

              if (isTaskHeading) {
                return new Paragraph({
                  spacing: { before: 180, after: 80 },
                  children: [
                    new TextRun({
                      text: trimmed,
                      bold: true,
                      size: 21,
                      color: '1E293B',
                    }),
                  ],
                });
              }

              return new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: trimmed,
                    size: 20,
                  }),
                ],
              });
            }),
          ],
        }] : []),
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `Modul_Ajar_${(data.temaSubtema || 'Kurikulum_Merdeka').replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error: any) {
    console.error('Error generating docx:', error);
    res.status(500).json({ status: 500, message: 'Gagal membuat file dokumen Word: ' + error.message });
  }
});

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Modul Ajar Generator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
