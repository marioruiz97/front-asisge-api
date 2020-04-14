export const environment = {
  production: true,
  authorization: 'Basic ' + btoa('AsisgeApp:clave123'),
  api_endpoint: 'http://localhost:8080/api/v1', // TODO: cambiar por enlace a heroku o aws
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
