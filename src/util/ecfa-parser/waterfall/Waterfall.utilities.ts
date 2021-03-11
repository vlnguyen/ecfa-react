import { WaterfallExcelScore } from "../../../types/Waterfall.types";

const folderNameRegex = /.*?\/(.*?\(S[NMHX] \d{1,2}\))\//;

export function generateWaterfallScoresLookup(rawScores: string):Map<string, WaterfallExcelScore> {
    const lines = rawScores.split('\n');
    for (let index = 0; index + 1 < lines.length; index += 2) {
        const match = lines[index].match(folderNameRegex);
        if (match === null) {
            console.error(`Error reading line: [${lines[index]}]`);
            continue;
        }
        const folderName = match[1];
        console.log(folderName);
    }
    return new Map<string, WaterfallExcelScore>();
}