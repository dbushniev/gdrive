import React from 'react';
import { GoogleApiProvider } from 'react-gapi'
import './App.css';
import 'antd/dist/antd.css';
import Picker from './components/Picker';
import GapiProvider from './lib/providers/GapiProvider';

function App() {
  return (
    <GoogleApiProvider clientId={process.env.REACT_APP_CLIENT_ID || ''}>
      <GapiProvider>
        <Picker />
      </GapiProvider>
    </GoogleApiProvider>
  );
}

export default App;