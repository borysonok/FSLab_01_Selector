var traverseDomAndCollectElements = function(matchFunc, startEl) {
  var resultSet = [];
  if (typeof startEl === 'undefined') {
    startEl = document.body;
  }
  // traverse the DOM tree and collect matching elements in resultSet
  // use matchFunc to identify matching elements
  traverseDomHelper(startEl, matchFunc, resultSet);
  return resultSet;
};

function traverseDomHelper(currentElem, matchFunc, resultSet) {
  if (matchFunc(currentElem)) {
    resultSet.push(currentElem);
  }
  if (currentElem && currentElem.children.length) {
    const childrenArr = currentElem.children;
    Object.values(childrenArr).forEach(elem => {
      return traverseDomHelper(elem, matchFunc, resultSet);
    });
  }
}

// detect and return the type of selector
// return one of these types: id, class, tag.class, tag

var selectorTypeMatcher = function(selector) {
  if (selector[0] === '#') {
    return 'id';
  } else if (selector[0] === '.') {
    return 'class';
  } else if (selector.indexOf('.') !== -1) {
    return 'tag.class';
  } else {
    return 'tag';
  }
};

// NOTE ABOUT THE MATCH FUNCTION
// remember, the returned matchFunction takes an
// * element * as a
// parameter and returns true/false depending on if
// that element
// matches the selector.

var matchFunctionMaker = function(selector) {
  var selectorType = selectorTypeMatcher(selector); //id
  var matchFunction;
  if (selectorType === 'id') {
    matchFunction = function(elem) {
      return elem.id === selector.slice(1);
    };
  } else if (selectorType === 'class') {
    matchFunction = function(elem) {
      const classesArr = elem.classList;
      if (Object.values(classesArr).indexOf(selector.slice(1)) !== -1) {
        return true;
      } else {
        return false;
      }
    };
  } else if (selectorType === 'tag.class') {
    matchFunction = function(elem) {
      var tagName = elem.localName;
      var classNamesArr = Object.values(elem.classList);
      if (
        tagName === selector.split('.')[0] &&
        classNamesArr.indexOf(selector.split('.')[1]) !== -1
      ) {
        return true;
      } else {
        return false;
      }
    };
  } else if (selectorType === 'tag') {
    matchFunction = function(elem) {
      return elem.nodeName.toLowerCase() === selector;
    };
  }
  return matchFunction;
};

var $ = function(selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
