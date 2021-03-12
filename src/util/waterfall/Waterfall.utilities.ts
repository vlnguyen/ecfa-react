import * as ExcelJS from 'exceljs';
import fs from 'file-saver';
import { default as songlist } from '../../res/songlist.json';
import { WaterfallExcelJudgements, WaterfallExcelScore, WaterfallScore } from "../../types/Waterfall.types";

const folderNameRegex = /.*?\/(.*?\(S[NMHX] \d{1,2}\))\//;

const edgeCaseSongFolders = new Set<string>([
    "Ave de Rapina (SX 11)",
    "Terra Firma (SX 12)",
]);

const expectedStepCountLookup: Record<string, number> = {
    "Terra Firma (OLD)": 821,
    "Terra Firma (UPDATED)": 815,
    "Ave de Rapina (OLD)": 578,
    "Ave de Rapina (UPDATED)": 579,
}

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

export async function exportScoresToExcel(scoresLookup: Map<string, WaterfallScore>) {
    const excelScores = generateWaterfallExcelScores(scoresLookup);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Scores');
    sheet.getColumn(1).width = sheet.getColumn(2).width = 52;
    sheet.addRows(excelScores.map(score => score.toExcelRow()));

    const data = await workbook.xlsx.writeBuffer();
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Scores.xlsx');
}

function generateWaterfallExcelScores(scoresLookup: Map<string, WaterfallScore>): WaterfallExcelScore[] {
    return songlist.map(song => {
        const emptyScore = new WaterfallExcelScore(song.chartName, song.folderName, null);
        const score = scoresLookup.get(song.folderName);
        if (score === undefined) {
            console.error(`Player hasn't completed this song: [${song.folderName}]`);
            return emptyScore;
        }

        if (edgeCaseSongFolders.has(song.folderName)) {
            const expectedStepCount = expectedStepCountLookup[song.chartName];
            if (expectedStepCount !== score.getTotalSteps()) {
                console.error(`Processing ${song.chartName}, expected ${expectedStepCount} steps, got ${score.getTotalSteps()} steps`);
                return emptyScore;
            }
        }

        return new WaterfallExcelScore(
            song.chartName,
            song.folderName,
            new WaterfallExcelJudgements(
                score.masterfuls,
                score.awesomes,
                score.minesHit + (song.holds + song.rolls - score.droppedHolds)
            )
        );
    });
}
