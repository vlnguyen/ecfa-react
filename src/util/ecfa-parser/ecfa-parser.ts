import { Workbook } from 'exceljs';
import { writeFileSync } from 'fs';
import { Chart } from '../../types/Chart.types';

enum ChartReferenceColumn {
    ChartName = 1,
    Steps = 2,
    Rolls = 3,
    Holds = 4,
    FolderName = 5,
}

const fileName = 'Songlist.xlsx';
new Workbook().xlsx.readFile('Songlist.xlsx').then(workbook => {    
    if (workbook.worksheets.length !== 1) {
        console.error("Workbook must contain exactly 1 worksheet.");
        return;
    }
    console.log(`Processing ${fileName}...`);

    const worksheet = workbook.getWorksheet(workbook.worksheets[0].name);
    const rowCount = worksheet.rowCount;
    let charts: Chart[] = [];
    let rowsProcessed = 0;

    // start at row 2 to skip the header row
    for (let rowIndex = 2; rowIndex <= rowCount; rowIndex++) {
        
        const row = worksheet.getRow(rowIndex);
        const chartName = row.getCell(ChartReferenceColumn.ChartName).model.value;
        if (chartName === undefined || chartName!.toString() === '???') {
            break;
        }

        charts.push(new Chart(
            row.getCell(ChartReferenceColumn.ChartName).model.value!.toString(),
            row.getCell(ChartReferenceColumn.FolderName).model.value!.toString(),
            parseInt(row.getCell(ChartReferenceColumn.Steps).model.value!.toString()),
            parseInt(row.getCell(ChartReferenceColumn.Rolls).model.value!.toString()),
            parseInt(row.getCell(ChartReferenceColumn.Holds).model.value!.toString()),
        ));
        rowsProcessed++;
    }

    const outputFilename = 'songlist.json';
    console.log(`Processed ${rowsProcessed} charts.`);
    console.log(`Writing to ${outputFilename}...`);
    writeFileSync(outputFilename, JSON.stringify(charts, null, 4));
    console.log(`Chart processing complete.`)
});
