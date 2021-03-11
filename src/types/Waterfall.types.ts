export class WaterfallScore {
    constructor(
        masterfuls: number,
        awesomes: number,
        solids: number,
        oks: number,
        faults: number,
        misses: number,
        droppedHolds: number,
        minesHit: number,
    ) {
        this.masterfuls = masterfuls;
        this.awesomes = awesomes;
        this.solids = solids;
        this.oks = oks;
        this.faults = faults;
        this.misses = misses;
        this.droppedHolds = droppedHolds;
        this.minesHit = minesHit;
    }
    
    masterfuls: number;
    awesomes: number;
    solids: number;
    oks: number;
    faults: number;
    misses: number;
    droppedHolds: number;
    minesHit: number;

    getTotalSteps = () => {
        return this.masterfuls
            + this.awesomes
            + this.solids
            + this.oks
            + this.faults
            + this.misses;
    }
}

export class WaterfallExcelScore {
    constructor(
        chartName: string,
        folderName: string,
        judgements: WaterfallExcelJudgements | null,
    ) {
        this.chartName = chartName;
        this.folderName = folderName;
        this.judgements = judgements;
    }
    
    chartName: string;
    folderName: string;
    judgements: WaterfallExcelJudgements | null;

    toExcelRow = () => {
        return [
            this.chartName,
            this.folderName,
            this.judgements?.mas ?? null,
            this.judgements?.awe ?? null,
            this.judgements?.red ?? null,
        ];
    };
}

export class WaterfallExcelJudgements {
    constructor(
        mas: number,
        awe: number,
        red: number,
    ) {
        this.mas = mas;
        this.awe = awe;
        this.red = red;
    }
    mas: number;
    awe: number;
    red: number;
}
