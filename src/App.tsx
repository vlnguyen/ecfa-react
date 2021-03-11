import React from 'react';
import Dropzone from 'react-dropzone';
import logo from './img/ecfa2021-logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
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
