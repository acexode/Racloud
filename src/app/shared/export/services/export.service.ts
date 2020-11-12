import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportExcel(jsonData: any[], fileName: string): void {
    const title = fileName;
    const header = Object.keys(jsonData[0]);
    const dataForExcel = [];
    jsonData.forEach((row: any) => {
      dataForExcel.push(Object.values(row));
    });
    const data = dataForExcel;

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Adding Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '008641' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    // Adding Data with Conditional Formatting
    data.forEach((d) => {
      worksheet.addRow(d);
    });
    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((v) => {
      const blob = new Blob([v], { type: this.fileType });
      fs.saveAs(blob, title + this.fileExtension);
    });
  }
}
