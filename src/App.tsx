import React from 'react';
import Dropzone from 'react-dropzone';
import * as ExcelJS from 'exceljs';
import fs from 'file-saver';
import { WaterfallScore } from './types/Waterfall.types';
import { default as songlist } from './res/songlist.json';
import logo from './img/ecfa2021-logo.png';
import './App.css';
import { generateWaterfallScoresLookup } from './util/ecfa-parser/waterfall/Waterfall.utilities';

function handleFileSelected<T extends File>(acceptedFiles: T[]) {
  const fileReader = new FileReader();
  fileReader.onloadend = async () => {
    generateWaterfallScoresLookup(fileReader.result as string);
  };
  fileReader.readAsText(acceptedFiles[0]);
  exportScoresToExcel();
}

async function exportScoresToExcel() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Scores');
  sheet.addRows(songlist.map(
      song => new WaterfallScore(song.chartName, song.folderName, 0, 0, 0).toExcelRow())
  );
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Scores.xlsx');
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Dropzone onDrop={handleFileSelected} multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} className="Dropzone">
                <input {...getInputProps()} />
                <p>Drop a player's ECFA2021.wf file here, or click to select a file.</p>
              </div>
            </section>
          )}
        </Dropzone>
      </header>
    </div>
  );
}

export default App;
