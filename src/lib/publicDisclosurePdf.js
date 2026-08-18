import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';
import {
  appendixDocumentSections,
  defaultResultYears,
  EXTRA_B_CATEGORIES,
  EXTRA_C_CATEGORIES,
  generalInformationRows,
  getDocumentForAppendixRow,
  infrastructureRows,
  normalizePublicDisclosureInfo,
  staffTeachingRows,
} from '@/lib/publicDisclosureConfig';

const COLORS = {
  navy: '#0a1628',
  gold: '#d4a853',
  border: '#d7dde5',
  header: '#e9edf3',
  alternate: '#f7f9fb',
  text: '#263244',
  muted: '#586577',
  link: '#1d4ed8',
  white: '#ffffff',
};

const PAGE = { width: 595.28, height: 841.89, margin: 42 };
const CONTENT_WIDTH = PAGE.width - (PAGE.margin * 2);

function valueOrNA(value) {
  return value && String(value).trim() ? String(value).trim() : 'NA';
}

function resultRowsForClass(rows, resultClass) {
  const filtered = (Array.isArray(rows) ? rows : [])
    .filter((row) => row.resultClass === resultClass)
    .sort((a, b) => String(a.year).localeCompare(String(b.year)));
  if (filtered.length) return filtered;
  return defaultResultYears.map((year) => ({
    year,
    registeredStudents: 'NA',
    studentsPassed: 'NA',
    passPercentage: 'NA',
    remarks: 'NA',
  }));
}

function publicDocumentUrl(document, origin) {
  if (!document?.fileUrl) return '';
  if (document.isStatic) return new URL(document.fileUrl, origin).toString();
  return `${origin}/api/public/mandatory-disclosure/${encodeURIComponent(document.id)}`;
}

export async function buildPublicDisclosurePdf({ info: rawInfo, documents: rawDocuments, origin }) {
  const info = normalizePublicDisclosureInfo(rawInfo);
  const documents = Array.isArray(rawDocuments) ? rawDocuments : [];
  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: PAGE.margin, right: PAGE.margin, bottom: 54, left: PAGE.margin },
    bufferPages: true,
    info: {
      Title: 'Mandatory Public Disclosures - Vasundhara Academy',
      Author: 'Vasundhara Academy',
      Subject: 'CBSE Appendix IX Public Disclosures',
    },
  });
  const chunks = [];
  pdf.on('data', (chunk) => chunks.push(chunk));
  const completed = new Promise((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
  });

  const ensureSpace = (height) => {
    if (pdf.y + height > PAGE.height - 62) pdf.addPage();
  };

  const sectionTitle = (title) => {
    ensureSpace(42);
    pdf.moveDown(0.55);
    const y = pdf.y;
    pdf.roundedRect(PAGE.margin, y, CONTENT_WIDTH, 28, 4).fill(COLORS.navy);
    pdf.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.white)
      .text(title, PAGE.margin + 10, y + 8, { width: CONTENT_WIDTH - 20 });
    pdf.y = y + 34;
  };

  const tableRow = (cells, widths, options = {}) => {
    const padding = 6;
    const normalized = cells.map((cell) => typeof cell === 'object' ? cell : { text: String(cell ?? '') });
    pdf.font(options.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(options.fontSize || 8.2);
    const height = Math.max(24, ...normalized.map((cell, index) => (
      pdf.heightOfString(String(cell.text ?? ''), { width: widths[index] - (padding * 2), lineGap: 1 }) + (padding * 2)
    )));
    ensureSpace(height + 2);
    const y = pdf.y;
    let x = PAGE.margin;

    normalized.forEach((cell, index) => {
      const background = options.header ? COLORS.header : options.alternate ? COLORS.alternate : COLORS.white;
      pdf.rect(x, y, widths[index], height).fillAndStroke(background, COLORS.border);
      pdf.font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(options.fontSize || 8.2)
        .fillColor(cell.link ? COLORS.link : COLORS.text)
        .text(String(cell.text ?? ''), x + padding, y + padding, {
          width: widths[index] - (padding * 2),
          height: height - (padding * 2),
          lineGap: 1,
          link: cell.link || undefined,
          underline: Boolean(cell.link),
        });
      x += widths[index];
    });
    pdf.y = y + height;
  };

  const infoTable = (rows) => {
    const widths = [40, 265, CONTENT_WIDTH - 305];
    tableRow(['SL No.', 'Information', 'Details'], widths, { header: true, bold: true });
    rows.forEach((row, index) => {
      const value = valueOrNA(info[row.key]);
      const detail = row.type === 'url' && value !== 'NA'
        ? { text: value, link: value }
        : value;
      tableRow([String(index + 1), row.label, detail], widths, { alternate: index % 2 === 1 });
    });
  };

  const documentTable = (section, extraCategories) => {
    const widths = [40, 306, CONTENT_WIDTH - 346];
    tableRow(['SL No.', 'Documents / Information', 'Uploaded Documents'], widths, { header: true, bold: true });
    section.rows.forEach((row, index) => {
      const document = getDocumentForAppendixRow(documents, row);
      const url = publicDocumentUrl(document, origin);
      tableRow([
        String(index + 1),
        document?.title || row.label,
        url ? { text: 'View PDF', link: url } : 'Not Uploaded',
      ], widths, { alternate: index % 2 === 1 });
    });
    const extras = documents
      .filter((document) => extraCategories.includes(document.category) && document.fileUrl)
      .sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.createdAt).localeCompare(String(b.createdAt)));
    extras.forEach((document, index) => {
      tableRow([
        String(section.rows.length + index + 1),
        document.title,
        { text: 'View PDF', link: publicDocumentUrl(document, origin) },
      ], widths, { alternate: (section.rows.length + index) % 2 === 1 });
    });
  };

  const resultTable = (resultClass) => {
    ensureSpace(38);
    pdf.moveDown(0.65).font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.navy)
      .text(`RESULT CLASS: ${resultClass === 'Class X' ? 'X' : 'XII'}`, PAGE.margin, pdf.y, { width: CONTENT_WIDTH });
    pdf.moveDown(0.35);
    const widths = [35, 60, 91, 80, 80, CONTENT_WIDTH - 346];
    tableRow(['SL', 'Year', 'Registered', 'Passed', 'Pass %', 'Remarks'], widths, { header: true, bold: true, fontSize: 7.7 });
    resultRowsForClass(info.resultRows, resultClass).forEach((row, index) => {
      tableRow([
        String(index + 1),
        valueOrNA(row.year),
        valueOrNA(row.registeredStudents),
        valueOrNA(row.studentsPassed),
        valueOrNA(row.passPercentage),
        valueOrNA(row.remarks),
      ], widths, { alternate: index % 2 === 1, fontSize: 7.7 });
    });
  };

  pdf.roundedRect(PAGE.margin, PAGE.margin, CONTENT_WIDTH, 68, 6).fill(COLORS.navy);
  pdf.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.white)
    .text('VASUNDHARA ACADEMY', PAGE.margin + 16, PAGE.margin + 14, { width: CONTENT_WIDTH - 32, align: 'center' });
  pdf.font('Helvetica').fontSize(10).fillColor(COLORS.gold)
    .text('MANDATORY PUBLIC DISCLOSURES - APPENDIX IX', PAGE.margin + 16, PAGE.margin + 42, { width: CONTENT_WIDTH - 32, align: 'center' });
  pdf.y = PAGE.margin + 80;
  pdf.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted)
    .text('This document is generated from the latest information maintained in the school Admin panel.', PAGE.margin, pdf.y, { width: CONTENT_WIDTH, align: 'center' });

  sectionTitle('A: GENERAL INFORMATION');
  infoTable(generalInformationRows);

  const bSection = appendixDocumentSections.find((section) => section.key === 'documents');
  sectionTitle('B: DOCUMENTS AND INFORMATION');
  documentTable(bSection, EXTRA_B_CATEGORIES);

  const cSection = appendixDocumentSections.find((section) => section.key === 'academics');
  sectionTitle('C: RESULT AND ACADEMICS');
  documentTable(cSection, EXTRA_C_CATEGORIES);
  resultTable('Class X');
  resultTable('Class XII');

  sectionTitle('D: STAFF TEACHING');
  infoTable(staffTeachingRows);

  sectionTitle('E: SCHOOL INFRASTRUCTURE');
  infoTable(infrastructureRows);

  const range = pdf.bufferedPageRange();
  for (let index = range.start; index < range.start + range.count; index += 1) {
    pdf.switchToPage(index);
    const bottomMargin = pdf.page.margins.bottom;
    pdf.page.margins.bottom = 0;
    pdf.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted)
      .text(`Vasundhara Academy | Public Disclosures | Page ${index + 1} of ${range.count}`, PAGE.margin, PAGE.height - 28, {
        width: CONTENT_WIDTH,
        align: 'center',
        lineBreak: false,
      });
    pdf.page.margins.bottom = bottomMargin;
  }

  pdf.end();
  return completed;
}
