export class Chart {
    constructor(    
        chartName: string,
        folderName: string,
        steps: number,
        rolls: number,
        holds: number,
    ) {
        this.chartName = chartName;
        this.folderName = folderName;
        this.steps = steps;
        this.rolls = rolls;
        this.holds = holds;
    }

    chartName: string;
    folderName: string;
    steps: number;
    rolls: number;
    holds: number;
}