import React from 'react';
import styles from './Filters.module.css';
import { DocumentQuery } from '../../lib/models/Document/DocumentQuery';
import { IHandleChangeFn } from '../../lib/models/Query/QueryChange';
import useFilters from '../../lib/hooks/useFilters';
import { Button, Dropdown, Input, Menu } from 'antd';
import { TableOutlined, BarsOutlined, SortAscendingOutlined, SortDescendingOutlined, FileTextOutlined} from '@ant-design/icons';
import { Layout } from '../../config/layout';
import { ORDER } from '../../config/order';

interface Props {
  layout: keyof typeof Layout;
  params: DocumentQuery;
  handleChangeParams: IHandleChangeFn<DocumentQuery>;
  handleChangeLayout: () => void;
}

const { Search } = Input;

const Filters: React.FC<Props> = (props) => {
  const {
    layout,
    params,
    handleChangeParams,
    handleChangeLayout
  } = props;

  const {
    input,
    handlePressEnter,
    handleChangeInput,
    handleChangeOrderBy,
    handleChangeOrder,
    orderByList,
  } = useFilters(params, handleChangeParams);

  return (
    <div className={styles.filters}>
      <Search
        value={input}
        onChange={handleChangeInput}
        onPressEnter={handlePressEnter}
        onSearch={handlePressEnter}
        className={styles.filters__search}
      />
      <div>
        <Button
          className={styles.filters__button}
          icon={layout === Layout.vertical ? <TableOutlined /> : <BarsOutlined />}
          onClick={handleChangeLayout}
        />
        <Button
          className={styles.filters__button}
          icon={params.order === ORDER.DESC ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          onClick={handleChangeOrder}
        />
        <Dropdown
          placement="bottomRight"
          trigger={['click']}
          overlay={(
            <Menu onClick={handleChangeOrderBy} selectable selectedKeys={[params.orderBy]}>
              {orderByList.map((item) => <Menu.Item key={item.value}>{item.label}</Menu.Item>)}
            </Menu>
          )}
        >
          <Button
            className={styles.filters__button}
            icon={<FileTextOutlined />}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Filters;