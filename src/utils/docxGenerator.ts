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
  Footer
} from 'docx';
import { ModulAjarData } from '../types';

export async function generateDocxBlob(data: ModulAjarData): Promise<Blob> {
  const tableBorderNone = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  };

  const tableBorderSolid = {
    top: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
    left: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
    right: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
  };

  const cellMargins = {
    top: 120,
    bottom: 120,
    left: 160,
    right: 160,
  };

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

  const createKeyValueRow = (key: string, value: string | string[]) => {
    const valText = Array.isArray(value) ? value.join('\n• ') : value;
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 3000, type: WidthType.DXA },
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [new TextRun({ text: key, bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 6500, type: WidthType.DXA },
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [new TextRun({ text: Array.isArray(value) ? `• ${valText}` : valText || '-', size: 20 })],
            }),
          ],
        }),
      ],
    });
  };

  // Build Table of Kegiatan Inti
  const kegiatanRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 1200, type: WidthType.DXA },
          shading: { fill: 'F1F5F9' },
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hari / Tahap', bold: true, size: 20 })] })],
        }),
        new TableCell({
          width: { size: 8300, type: WidthType.DXA },
          shading: { fill: 'F1F5F9' },
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: 'Uraian Kegiatan Pembelajaran Mendalam (Deep Learning)', bold: true, size: 20 })] })],
        }),
      ],
    }),
  ];

  if (data.kegiatanHarian && data.kegiatanHarian.length > 0) {
    data.kegiatanHarian.forEach((hari) => {
      const paras: Paragraph[] = [];
      paras.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `Tahap: ${hari.tahap}`,
              bold: true,
              color: '2563EB',
              size: 20,
            }),
          ],
        })
      );

      hari.kegiatan.forEach((keg, idx) => {
        paras.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: `Kegiatan ${idx + 1} (JP ${keg.jp}): ${keg.judul}`,
                bold: true,
                size: 20,
              }),
            ],
          })
        );
        if (keg.prinsipDeepLearning) {
          paras.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                new TextRun({ text: `• Prinsip Deep Learning: `, bold: true, color: '047857', size: 18 }),
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
                new TextRun({ text: `• Sintaks Model: `, bold: true, color: '0369A1', size: 18 }),
                new TextRun({ text: keg.sintaksModel, size: 18 }),
              ],
            })
          );
        }
        if (keg.dimensi) {
          paras.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: `Dimensi Profil: `, italics: true, bold: true, size: 18 }),
                new TextRun({ text: keg.dimensi, italics: true, size: 18 }),
              ],
            })
          );
        }
        if (keg.alatBahan) {
          paras.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: `Alat & Bahan: `, bold: true, size: 18 }),
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
        if (keg.langkah && keg.langkah.length > 0) {
          keg.langkah.forEach((l, lIdx) => {
            paras.push(
              new Paragraph({
                spacing: { after: 20 },
                bullet: { level: 0 },
                children: [new TextRun({ text: `${lIdx + 1}. ${l}`, size: 18 })],
              })
            );
          });
        }
      });

      kegiatanRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1200, type: WidthType.DXA },
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
              width: { size: 8300, type: WidthType.DXA },
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
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Modul Ajar Kurikulum Merdeka - ${data.namaSekolah || 'Satuan Pendidikan'}`,
                    size: 16,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Disusun oleh: ${data.namaPenyusun || 'Guru Kelas'} | Pendekatan Deep Learning`,
                    size: 16,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Header / Judul
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'MODUL AJAR KURIKULUM MERDEKA',
                bold: true,
                size: 32,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)`,
                bold: true,
                size: 22,
                color: '0369A1',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `Fase ${data.fase} - ${data.kelas} | ${data.namaSekolah || 'Satuan Pendidikan'}`,
                italics: true,
                size: 20,
              }),
            ],
          }),

          // A. INFORMASI UMUM & IDENTITAS
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

          // B. IDENTIFIKASI PEMBELAJARAN
          createHeadingPara('B. IDENTIFIKASI PEMBELAJARAN', 1),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            borders: tableBorderSolid,
            rows: [
              createKeyValueRow('Karakteristik Peserta Didik', data.identifikasiPesertaDidik),
              createKeyValueRow('Materi Pembelajaran', data.materiPembelajaran),
              createKeyValueRow(
                'Dimensi Profil Lulusan / P3',
                data.dimensiProfilLulusan && data.dimensiProfilLulusan.length > 0
                  ? data.dimensiProfilLulusan.map((d) => d)
                  : '-'
              ),
            ],
          }),

          // C. DESAIN PEMBELAJARAN
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

          // D. RENCANA PELAKSANAAN PEMBELAJARAN
          createHeadingPara('D. RENCANA PELAKSANAAN PEMBELAJARAN', 1),
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({
                text: '1. Kegiatan Awal (Berkesadaran, Bermakna, Menggembirakan)',
                bold: true,
                size: 22,
              }),
            ],
          }),
          ...(data.rencanaPelaksanaanAwal || []).map(
            (item) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [new TextRun({ text: item, size: 20 })],
              })
          ),

          new Paragraph({
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({
                text: '2. Kegiatan Inti Pembelajaran (Memahami, Mengaplikasi, Merefleksi)',
                bold: true,
                size: 22,
              }),
            ],
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
            children: [
              new TextRun({
                text: '3. Kegiatan Penutup (Berkesadaran, Menggembirakan)',
                bold: true,
                size: 22,
              }),
            ],
          }),
          ...(data.rencanaPelaksanaanPenutup || []).map(
            (item) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [new TextRun({ text: item, size: 20 })],
              })
          ),

          // E. ASESMEN & EVALUASI
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

          // Tanda Tangan Pengesahan
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
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Ditetapkan di: ........................, ${data.bulan} ${new Date().getFullYear()}`, size: 20 })] }),
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
            text: 'LEMBAR KERJA PESERTA DIDIK (LKPD)',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...data.lkpdLengkap.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 22 })],
              spacing: { after: 200 },
            })
          ),
        ],
      }] : []),
    ],
  });

  return await Packer.toBlob(doc);
}
