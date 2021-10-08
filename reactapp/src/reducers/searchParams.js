export default function (searchParams = { code: 'fr', lang: 'fr' }, action) {

  if (action.type === 'selectCountry') {
    return action.countryParams;
  }
  else {
    return searchParams;
  }
}