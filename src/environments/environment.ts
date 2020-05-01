// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authorization: 'Basic ' + btoa('AsisgeApp:clave123'),
  api_endpoint: 'http://localhost:8080/api/v1',
  /* api_endpoint: 'https://test-bd-elenchos.herokuapp.com/api/v1', */
  token_path: 'oauth/token',
  grant_type: 'password',

  firebase: {
    apiKey: 'AIzaSyCleMrpWObWEo7hOnhyouOWGmfAna8rsXg',
    authDomain: 'elenchos-software.firebaseapp.com',
    databaseURL: 'https://elenchos-software.firebaseio.com',
    projectId: 'elenchos-software',
    storageBucket: 'elenchos-software.appspot.com',
    messagingSenderId: '738259238622',
    appId: '1:738259238622:web:302943c1e0725000880c4f',
    measurementId: 'G-758PLNHBW0'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
