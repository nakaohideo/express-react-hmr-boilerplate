import isString from '../../common/utils/isString';

/**
 * @returns {boolean} isPassed
 */
let validateErrorObject = (nestedErrors) => {
  if (isString(nestedErrors)) {
    return false;
  } else {
    let keys = Object.keys(nestedErrors);
    if (keys.length === 0) {
      return true;
    } else {
      let isPass = keys.every((key) => {
        let nestedError = nestedErrors[key];
        let isPass = validateErrorObject(nestedError);
        return isPass;
      });
      return isPass;
    }
  }
};

export default validateErrorObject;
