import ErrorTypes from '../constants/ErrorTypes';
import Errors from '../../common/constants/Errors';

let getErrorHandler = (ErrorType) => (res) => (fn) => (err, ...result) => {
  if (err) {
    switch (ErrorType) {
      case ErrorTypes.ODM_OPERATION: {
        res.pushError(Errors.ODM_OPERATION_FAIL, err);
        break;
      }
      default: {
        res.pushError(Errors.UNKNOWN_EXCEPTION, err);
      }
    }
  } else {
    fn(...result);
  }
};

let handleDbError = getErrorHandler(ErrorTypes.ODM_OPERATION);

export { handleDbError };
