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
        <p>Songlist last updated: May 17, 2021</p>
        <em>Fixed parsing folder names that don't have difficulty labels.</em>
      </header>
    </div>
  );
}

export default App;
