export const PUBLIC_DISCLOSURE_INFO_SLUG = 'public-disclosures-info';

export const publicDisclosureDefaults = {
  schoolName: '',
  affiliationNo: '',
  schoolCode: '',
  address: '',
  principalDetails: '',
  schoolEmail: '',
  contactDetails: '',
  principal: '',
  vicePrincipal: '',
  headmaster: '',
  totalTeachers: '',
  pgt: '',
  tgt: '',
  prt: '',
  ntt: '',
  teacherSectionRatio: '',
  specialEducator: '',
  counsellor: '',
  campusArea: '',
  classrooms: '',
  laboratories: '',
  librarySize: '',
  internetFacility: '',
  girlsToilets: '',
  boysToilets: '',
  cwsnToilets: '',
  infrastructureVideoUrl: '',
  resultRows: [],
};

export const resultClassOptions = ['Class X', 'Class XII'];
export const defaultResultYears = ['2024', '2025', '2026'];
export const EXTRA_B_CATEGORIES = [
  'public-disclosure-b-extra',
  'public-disclosure-b-additional',
];
export const EXTRA_C_CATEGORIES = ['public-disclosure-c-extra'];

export const generalInformationRows = [
  { key: 'schoolName', label: 'Name of the School' },
  { key: 'affiliationNo', label: 'Affiliation No.' },
  { key: 'schoolCode', label: 'School Code' },
  { key: 'address', label: 'Complete Address with Pin Code' },
  { key: 'principalDetails', label: 'Principal Name & Qualification' },
  { key: 'schoolEmail', label: 'School Email ID' },
  { key: 'contactDetails', label: 'Contact Details' },
];

export const staffTeachingRows = [
  { key: 'principal', label: 'Principal' },
  { key: 'vicePrincipal', label: 'Vice Principal' },
  { key: 'headmaster', label: 'Headmistress / Headmaster' },
  { key: 'totalTeachers', label: 'Total Number of Teachers' },
  { key: 'pgt', label: 'PGT' },
  { key: 'tgt', label: 'TGT' },
  { key: 'prt', label: 'PRT' },
  { key: 'ntt', label: 'NTT' },
  { key: 'teacherSectionRatio', label: 'Teachers Section Ratio' },
  { key: 'specialEducator', label: 'Details of Special Educator' },
  { key: 'counsellor', label: 'Details of Counsellor and Wellness Teacher' },
];

export const infrastructureRows = [
  { key: 'campusArea', label: 'Total Campus Area of the School' },
  { key: 'classrooms', label: 'Number and Size of Classrooms' },
  { key: 'laboratories', label: 'Number and Size of Laboratories including Computer Labs' },
  { key: 'librarySize', label: 'Number and Size of Library' },
  { key: 'internetFacility', label: 'Internet Facility' },
  { key: 'girlsToilets', label: 'Number of Girls Toilets' },
  { key: 'boysToilets', label: 'Number of Boys Toilets' },
  { key: 'cwsnToilets', label: 'Number of CWSN Toilets' },
  {
    key: 'infrastructureVideoUrl',
    label: 'Link of YouTube Video of the Inspection of School Covering the Infrastructure of the School',
    type: 'url',
  },
];

export const appendixDocumentSections = [
  {
    key: 'documents',
    title: 'B: DOCUMENTS AND INFORMATION',
    rows: [
      {
        category: 'appendix-b-affiliation-letter',
        label: 'Affiliation status and period of affiliation',
        legacyCategories: ['affiliation'],
        legacyTitleIncludes: ['affiliation', 'upgradation', 'extension'],
      },
      {
        category: 'appendix-b-registration-certificate',
        label: 'Copies of Societies / Trust / Company Registration / Renewal Certificate, as applicable',
        legacyTitleIncludes: ['society', 'trust', 'registration', 'renewal'],
      },
      {
        category: 'appendix-b-noc',
        label: 'Copy of No Objection Certificate (NOC), if applicable',
        legacyTitleIncludes: ['noc', 'no objection'],
      },
      {
        category: 'appendix-b-rte-recognition',
        label: 'Copies of Recognition Certificate under RTE Act, 2009, and its renewal if applicable',
        legacyTitleIncludes: ['recognition', 'rte'],
      },
      {
        category: 'appendix-b-building-safety',
        label: 'Copy of Valid Building Safety Certificate',
        legacyCategories: ['self-affidavit'],
        legacyTitleIncludes: ['building safety', 'structural safety'],
      },
      {
        category: 'appendix-b-fire-safety',
        label: 'Copy of Valid Fire Safety Certificate',
        legacyTitleIncludes: ['fire safety'],
      },
      {
        category: 'appendix-b-deo-self-certification',
        label: 'Copy of DEO Certificate / Self Certification by School',
        legacyTitleIncludes: ['deo', 'self certification', 'self-affidavit', 'self affidavit'],
      },
      {
        category: 'appendix-b-water-health-sanitation',
        label: 'Copies of Valid Water, Health and Sanitation Certificates',
        legacyTitleIncludes: ['water', 'health', 'sanitation'],
      },
    ],
  },
  {
    key: 'academics',
    title: 'C: RESULT AND ACADEMICS',
    rows: [
      {
        category: 'appendix-c-fee-structure',
        label: 'Fee Structure of the School / Fee Fixation Norms & fee structure',
        legacyTitleIncludes: ['fee structure'],
      },
      {
        category: 'appendix-c-academic-calendar',
        label: 'Annual Academic Calendar',
        legacyCategories: ['academic'],
        legacyTitleIncludes: ['academic calendar', 'calendar'],
      },
      {
        category: 'appendix-c-smc',
        label: 'School Management Committee (SMC)',
        legacyTitleIncludes: ['smc', 'school management committee'],
      },
      {
        category: 'appendix-c-pta',
        label: 'Parent Teacher Association (PTA) Members',
        legacyTitleIncludes: ['pta', 'parents teachers association'],
      },
      {
        category: 'appendix-c-board-result',
        label: 'Last Three-Year Result of the Board Examination as per applicability',
        legacyCategories: ['result'],
        legacyTitleIncludes: ['board result', 'three-year result', 'class 10 board results'],
      },
    ],
  },
];

export const appendixDocumentRows = appendixDocumentSections.flatMap((section) => section.rows);
export const appendixDocumentCategories = appendixDocumentRows.map((row) => row.category);

export function normalizeResultRows(rows = []) {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row, index) => ({
      id: typeof row.id === 'string' && row.id ? row.id : `result-${Date.now()}-${index}`,
      resultClass: resultClassOptions.includes(row.resultClass) ? row.resultClass : 'Class X',
      year: typeof row.year === 'string' ? row.year : String(row.year || ''),
      registeredStudents: typeof row.registeredStudents === 'string' ? row.registeredStudents : String(row.registeredStudents || ''),
      studentsPassed: typeof row.studentsPassed === 'string' ? row.studentsPassed : String(row.studentsPassed || ''),
      passPercentage: typeof row.passPercentage === 'string' ? row.passPercentage : String(row.passPercentage || ''),
      remarks: typeof row.remarks === 'string' ? row.remarks : String(row.remarks || ''),
    }))
    .filter((row) => row.year || row.registeredStudents || row.studentsPassed || row.passPercentage || row.remarks);
}

export function normalizePublicDisclosureInfo(info = {}) {
  const normalized = Object.fromEntries(
    Object.keys(publicDisclosureDefaults)
      .filter((key) => key !== 'resultRows')
      .map((key) => [key, typeof info[key] === 'string' ? info[key] : ''])
  );

  return {
    ...publicDisclosureDefaults,
    ...normalized,
    resultRows: normalizeResultRows(info.resultRows),
  };
}

export function getDocumentForAppendixRow(documents, row) {
  const items = Array.isArray(documents) ? documents : [];
  const exact = items.find((doc) => doc.category === row.category);
  if (exact) return exact;

  return items.find((doc) => {
    if (!doc?.fileUrl || appendixDocumentCategories.includes(doc.category)) return false;
    const title = (doc.title || '').toLowerCase();
    const categoryMatch = row.legacyCategories?.includes(doc.category);
    const titleMatch = row.legacyTitleIncludes?.some((term) => title.includes(term));
    return categoryMatch || titleMatch;
  });
}
