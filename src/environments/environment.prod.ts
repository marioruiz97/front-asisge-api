export const environment = {
  production: true,
  authorization: 'Basic ' + btoa('AsisgeApp:clave123'),
  api_endpoint: 'https://test-bd-elenchos.herokuapp.com/api/v1', // TODO: cambiar por enlace a heroku o aws
  token_path: 'oauth/token',
  grant_type: 'password',
};
