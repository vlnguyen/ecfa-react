import React from 'react';
import Dropzone from 'react-dropzone';
import logo from './img/ecfa2021-logo.png';
import './App.css';
import { exportScoresToExcel, generateWaterfallScoresLookup } from './util/waterfall/Waterfall.utilities';

function handleFileSelected<T extends File>(acceptedFiles: T[]) {
  const fileReader = new FileReader();
  fileReader.onloadend = async () => {
    const scoresLookup = generateWaterfallScoresLookup(fileReader.result as string);
    exportScoresToExcel(scoresLookup);
  };

  fileReader.readAsText(acceptedFiles[0]);
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
        <p>Songlist last updated: April 8, 2021</p>
        <p>
          <i>
            Fixed an issue with Ablife, IDWK, Born Cursed, and Negative Nature folder names.
          </i>
        </p>
      </header>
    </div>
  );
}

export default App;
