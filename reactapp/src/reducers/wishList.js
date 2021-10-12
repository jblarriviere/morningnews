export default function (wishList = [], action) {

  if (action.type === 'setWishlist') {

    return action.wishlist;

  } else if (action.type === 'addArticle') {

    if (wishList.find(elem => elem.title === action.article.title)) {
      return wishList;
    }

    let newList = [...wishList];
    newList.push({ ...action.article, read: false });
    return newList;

  }
  else if (action.type === 'removeArticle') {

    return wishList.filter(elem => elem.title !== action.article.title);

  }
  else if (action.type === 'readArticle') {

    return wishList.map(elem => {
      if (elem.title !== action.article.title) {
        return elem;
      } else {
        let newElem = elem;
        newElem.read = true;
        return newElem;
      }
    });

  }
  else {

    return wishList;

  }
}