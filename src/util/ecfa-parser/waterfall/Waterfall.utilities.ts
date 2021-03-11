import * as ExcelJS from 'exceljs';
import fs from 'file-saver';
import { default as songlist } from '../../../res/songlist.json';
import { WaterfallExcelScore, WaterfallScore } from "../../../types/Waterfall.types";

const folderNameRegex = /.*?\/(.*?\(S[NMHX] \d{1,2}\))\//;

export function generateWaterfallScoresLookup(rawScores: string): Map<string, WaterfallScore> {
    const scoresLookup = new Map<string, WaterfallScore>();
    const lines = rawScores.split('\n');
    for (let index = 0; index + 1 < lines.length; index += 2) {
        const match = lines[index].match(folderNameRegex);
        if (match === null) {
            console.error(`Error reading line: [${lines[index]}]`);
            continue;
        }
        const folderName = match[1];
        scoresLookup.set(folderName, processJudgementsRow(lines[index + 1]));
    }
    return scoresLookup;
}

function processJudgementsRow(row: string): WaterfallScore {
    const judgements = row.split(',').map(val => parseInt(val));
    return new WaterfallScore(
        judgements[0],
        judgements[1],
        judgements[2],
        judgements[3],
        judgements[4],
        judgements[5],
        judgements[6],
        judgements[7]
    );
}

export async function exportScoresToExcel(_scoresLookup: Map<string, WaterfallScore>) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Scores');
    sheet.addRows(songlist.map(
        song => new WaterfallExcelScore(song.chartName, song.folderName, 0, 0, 0).toExcelRow())
    );
    const data = await workbook.xlsx.writeBuffer();
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Scores.xlsx');
}
