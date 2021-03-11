import * as ExcelJS from 'exceljs';
import fs from 'file-saver';
import { default as songlist } from '../../res/songlist.json';
import { WaterfallExcelJudgements, WaterfallExcelScore, WaterfallScore } from "../../types/Waterfall.types";

const folderNameRegex = /.*?\/(.*?\(S[NMHX] \d{1,2}\))\//;

const TERRA_FIRMA_OLD_STEPCOUNT = 821;
const TERRA_FIRMA_NEW_STEPCOUNT = 815;

const AVE_DE_RAPINA_OLD_STEPCOUNT = 578;
const AVE_DE_RAPINA_NEW_STEPCOUNT = 579;

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

        // edge case: Terra Firma [mute] updated chart
        if (song.folderName === "Terra Firma (SX 12)") {
            const expectedStepCount = song.chartName === 'Terra Firma (OLD)'
                ? TERRA_FIRMA_OLD_STEPCOUNT
                : TERRA_FIRMA_NEW_STEPCOUNT
            
            if (expectedStepCount !== score.getTotalSteps()) {
                console.error(`Processing ${song.chartName}, expected ${expectedStepCount} steps, got ${score.getTotalSteps()} steps`);
                return emptyScore;
            }
        }

        // edge case: Ave de Rapina [mute] updated chart
        if (song.folderName === "Ave de Rapina (SX 11)") {
            const expectedStepCount = song.chartName === 'Ave de Rapina (OLD)'
                ? AVE_DE_RAPINA_OLD_STEPCOUNT
                : AVE_DE_RAPINA_NEW_STEPCOUNT
        
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
