export class WaterfallScore {
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