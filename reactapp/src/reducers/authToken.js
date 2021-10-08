export default function (authToken = '', action) {

  if (action.type === 'login') {
    return action.token;
  }
  else if (action.type === 'logout') {
    return '';
  }
  else {
    return authToken;
  }
}