import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './List.module.css';
import classNames from 'classnames';
import { List } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Document } from '../../lib/models/Document/Document';
import { Key } from 'react';
import { Layout } from '../../config/layout';
import PdfIcon from '../../assets/pdf_icon.png';
import scrollControl from '../../lib/utils/scrollControl';
import audioClick from '../../lib/utils/audioClick';

interface Props {
  list: Document[];
  layout: keyof typeof Layout;
  handleFileClick: (id: Key, name: string) => void;
  isLoading?: boolean
}

const ListComponent: React.FC<Props> = (props) => {
  const {
    list,
    layout,
    handleFileClick,
    isLoading = false,
  } = props;

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('keydown', handleScrollList);
    return () => document.removeEventListener('keydown', handleScrollList);
  }, [])

  const handleScrollList = useCallback((e: KeyboardEvent) => {
    if (listRef.current) scrollControl(e, listRef.current)
  }, []);

  const isHorizontal = useMemo(() => layout === Layout.horizontal, [layout]);

  return (
    <div className={styles.list} ref={listRef}>
      <List
        size="small"
        grid={isHorizontal ? undefined : { column: 4, gutter: 10 }}
        dataSource={list}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={classNames(styles.item, {[styles.horizontal__item]: isHorizontal})}
          >
            <CloudDownloadOutlined className={styles.item__icon} onClick={audioClick(() => handleFileClick(item.id, item.name))}/>
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
    </div>
  );
};

export default ListComponent;