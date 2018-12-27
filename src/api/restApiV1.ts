import wretch from 'wretch';
import {keys} from '../models';
import {StorageUtils} from '../utils/index';
import {RestApi} from './restApi';

// tslint:disable-next-line:no-var-requires
const URLSearchParams = require('url-search-params');

const tokenStorage = StorageUtils(keys.token);

export class RestApiV1 extends RestApi {
  protected readonly wretcher = () => {
    const baseWretcher = wretch(process.env.REACT_APP_APIV1_URL).polyfills({
      URLSearchParams
    });
    const hasToken = tokenStorage.get();
    return hasToken
      ? baseWretcher.auth(`Bearer ${tokenStorage.get()}`)
      : baseWretcher;
  };
}

export default RestApiV1;
