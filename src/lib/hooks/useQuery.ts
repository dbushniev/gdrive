import {useState} from 'react';
import _ from 'lodash'
import { IHandleChangeFn } from '../models/Query/QueryChange';

const useQuery = <T extends object>(par: T) => {
  const [params, setParams] = useState<T>(par);

  const handleChangeParams: IHandleChangeFn<T> = (queries) => {
    if (!_.isEqual(params, queries)) setParams((state) => ({ ...state, ...queries }));
  };

  return {
    params,
    handleChangeParams,
  };
};

export default useQuery;