import React, { useMemo } from 'react';
import styles from './List.module.css';
import classNames from 'classnames';
import { List } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Document } from '../../lib/models/Document/Document';
import { Key } from 'react';
import { Layout } from '../../config/layout';
import PdfIcon from '../../assets/pdf_icon.png';

interface Props {
  list: Document[];
  layout: keyof typeof Layout;
  handleFileClick: (id: Key) => void;
  isLoading?: boolean
}

const ListComponent: React.FC<Props> = (props) => {
  const {
    list,
    layout,
    handleFileClick,
    isLoading = false
  } = props;

  const isHorizontal = useMemo(() => layout === Layout.horizontal, [layout]);

  return (
    <List
      size="small"
      grid={isHorizontal ? undefined : { column: 4, gutter: 10 }}
      dataSource={list}
      bordered
      loading={isLoading}
      className={styles.list}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          className={classNames(styles.item, {[styles.horizontal__item]: isHorizontal})}
        >
          <CloudDownloadOutlined className={styles.item__icon} onClick={() => handleFileClick(item.id)}/>
          <div className={classNames(styles.item_imgContainer, {[styles.horizontal__imgContainer]: isHorizontal})}>
            <img
              className={classNames(styles.item__img, {[styles.horizontal__img]: isHorizontal})}
              alt={item.thumbnailLink}
              src={item.thumbnailLink}
            />
          </div>
          <div className={classNames(styles.item__info, {[styles.horizontal__info]: isHorizontal})}>
            <img src={PdfIcon} alt="pdf icon"/>
            <div className={classNames(styles.item__title, {[styles._leftMargin]: isHorizontal})}>{item.name}</div>
          </div>
        </List.Item>
      )}
    />
  );
};

export default ListComponent;