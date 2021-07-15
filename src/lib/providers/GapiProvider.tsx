import React, { useEffect, useMemo } from 'react';
import {useContext} from "react";
import { useGoogleApi } from 'react-gapi';

interface IGapiProvider {
  isSignIn: boolean;
  gapi?: {[key: string]: any};
}

const initialState: IGapiProvider = {
  gapi: undefined,
  isSignIn: false
};

const GapiContext = React.createContext(initialState);
export const useGapiContext = () => useContext(GapiContext);

const GapiProvider: React.FC = (props) => {
  const { children } = props;

  const gapi = useGoogleApi({
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.appdata',
      'https://www.googleapis.com/auth/drive.metadata',
      'https://www.googleapis.com/auth/drive.photos.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ] as never[],
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'] as never[],
  });

  const isSignIn = useMemo(() => !!gapi?.auth2.getAuthInstance().isSignedIn.get(), [!!gapi?.auth2.getAuthInstance().isSignedIn.get()]);


  useEffect(() => {
    if (gapi) gapi.client.setApiKey(process.env.REACT_APP_GDRIVE_API_KEY);
  }, [gapi]);

  return (
    <GapiContext.Provider value={{ gapi, isSignIn }}>
      {children}
    </GapiContext.Provider>
)
};

export default GapiProvider;
