export const comprehensiveInformationRows = [
  {
    rowKey: 'school-contact-details',
    title: 'School Name, Postal address, Email, Telephone Nos of school and authorities',
  },
  {
    rowKey: 'affiliation-status-period',
    title: 'Affiliation status and period of affiliation',
  },
  {
    rowKey: 'mandatory-public-disclosures',
    title: 'Mandatory Public Disclosures (MPD)',
  },
  {
    rowKey: 'curriculum-details',
    title: 'Details of Curriculum',
  },
  {
    rowKey: 'infrastructure-details',
    title: 'Infrastructure details',
  },
  {
    rowKey: 'transfer-certificates',
    title: 'Transfer certificates issued to students',
  },
  {
    rowKey: 'teachers-training-development',
    title: 'Teachers training and Development Program',
  },
  {
    rowKey: 'annual-report',
    title: 'Annual Report',
  },
  {
    rowKey: 'self-affidavit',
    title: 'Self Affidavit',
  },
  {
    rowKey: 'pocso-committee',
    title: 'Protection of Children from Sexual Offences (POCSO) Committee',
  },
  {
    rowKey: 'posh-committee',
    title: 'Prevention of Sexual Harassment (POSH) Committee',
  },
  {
    rowKey: 'grievance-redressal-committee',
    title: 'Grievance Redressal Committee (GRC)',
  },
  {
    rowKey: 'sakhi-savitri-committee',
    title: 'Sakhi Savitri Committee details',
  },
  {
    rowKey: 'sectionwise-student-strength',
    title: 'Sectionwise Student Strength',
  },
  {
    rowKey: 'staff-statement',
    title: 'Details of teachers with qualifications (Staff Statement)',
  },
  {
    rowKey: 'academic-calendar',
    title: 'Academic Calendar',
  },
  {
    rowKey: 'prescribed-books',
    title: 'List of books prescribed in various classes',
  },
  {
    rowKey: 'school-management-committee',
    title: 'School Management Committee (SMC)',
  },
  {
    rowKey: 'fee-fixation-structure',
    title: 'Fee Fixation Norms & fee structure (classwise)',
  },
  {
    rowKey: 'parent-teacher-association',
    title: 'Parent Teacher Association (PTA) committee',
  },
  {
    rowKey: 'academic-achievements',
    title: 'Academic Achievements',
  },
  {
    rowKey: 'school-circulars',
    title: 'School Circulars',
  },
  {
    rowKey: 'library-details',
    title: 'Library Details: Number of library books section-wise, magazines, periodicals and newspapers',
  },
  {
    rowKey: 'no-homework-policy',
    title: 'No Homework Policy',
  },
  {
    rowKey: 'manager-principal-declaration',
    title: 'Declaration duly signed by the Manager and the Principal',
  },
];

export const comprehensiveInformationCategories = comprehensiveInformationRows.map((row) => categoryForComprehensiveRow(row.rowKey));

export function categoryForComprehensiveRow(rowKey) {
  return `comprehensive-information:${rowKey}`;
}

export function rowForComprehensiveKey(rowKey) {
  return comprehensiveInformationRows.find((row) => row.rowKey === rowKey);
}

export function isPdfUrl(fileUrl) {
  return typeof fileUrl === 'string' && fileUrl.trim().toLowerCase().split('?')[0].endsWith('.pdf');
}

export function mapComprehensiveRows(documents = []) {
  const items = Array.isArray(documents) ? documents : [];

  return comprehensiveInformationRows.map((row, index) => {
    const category = categoryForComprehensiveRow(row.rowKey);
    const document = items.find((doc) => doc.category === category && doc.fileUrl);
    return {
      ...row,
      slNo: index + 1,
      category,
      document: document || null,
      pdfUrl: document?.fileUrl || '',
    };
  });
}
