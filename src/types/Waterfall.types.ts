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
}

export class WaterfallExcelScore {
    constructor(
        chartName: string,
        folderName: string,
        mas: number,
        awe: number,
        red: number,
    ) {
        this.chartName = chartName;
        this.folderName = folderName;
        this.mas = mas;
        this.awe = awe;
        this.red = red;
    }

    chartName: string;
    folderName: string;
    mas: number;
    awe: number;
    red: number;

    toExcelRow = () => {
        return [
            this.chartName,
            this.folderName,
            this.mas,
            this.awe,
            this.red,
        ];
    };
}
