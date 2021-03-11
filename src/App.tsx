import React from 'react';
import Dropzone from 'react-dropzone';
import logo from './img/ecfa2021-logo.png';
import './App.css';

function handleFileSelected<T extends File>(acceptedFiles: T[]) {
  const fileReader = new FileReader();
  fileReader.onloadend = async (e) => {
    const content = fileReader.result;
    console.log(content);
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
      </header>
    </div>
  );
}

export default App;
