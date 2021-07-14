import { ChangeEvent, useMemo } from 'react';
import { useState } from 'react';
import { DocumentQuery } from '../models/Document/DocumentQuery';
import { IHandleChangeFn } from '../models/Query/QueryChange';
import { List } from '../models/List/List';
import { ORDER, ORDER_BY } from '../../config/order';

const useFilters = (params: DocumentQuery, handleChangeParams: IHandleChangeFn<DocumentQuery>) => {
  const [input, setInput] = useState<string>('')

  const handlePressEnter = () => handleChangeParams({ search: input });
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleClearInput = () => setInput('');

  const handleChangeOrderBy = ({ key: orderBy }: { key: string }) => handleChangeParams({ orderBy })
  const handleChangeOrder = () => handleChangeParams({ order: params.order === ORDER.ASC ? ORDER.DESC : ORDER.ASC })


  const orderByList: List[] = useMemo(() => [
    { label: 'Name', value: ORDER_BY.NAME },
    { label: 'Recency', value: ORDER_BY.RECENCY },
  ],[]);

  return {
    input,
    handlePressEnter,
    handleChangeInput,
    handleClearInput,
    handleChangeOrderBy,
    handleChangeOrder,
    orderByList,
  }
}

export default useFilters;