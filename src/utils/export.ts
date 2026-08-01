import * as XLSX from 'xlsx';

export const exportExcel = <T extends Record<string, unknown>>(
  data: T[],
  columns: { title: string; dataIndex: keyof T }[],
  filename: string,
): void => {
  const header = columns.map((col) => col.title);
  const rows = data.map((item) => columns.map((col) => item[col.dataIndex]));
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportJsonToExcel = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};