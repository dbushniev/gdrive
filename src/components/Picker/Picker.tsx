import React, { useState } from 'react';
import { useGapiContext } from '../../lib/providers/GapiProvider';
import useFiles from '../../lib/hooks/useFiles';
import useQuery from '../../lib/hooks/useQuery';
import { DocumentQuery } from '../../lib/models/Document/DocumentQuery';
import userConfig from '../../config/user';
import { ORDER, ORDER_BY } from '../../config/order';
import ListComponent from '../List';
import Filters from '../Filters';
import { Button, PageHeader } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import styles from './Picker.module.css';
import { Layout } from '../../config/layout';
import Auth from '../Auth';
import Spinner from '../Spinner';

interface Props {}

const Picker: React.FC<Props> = (props) => {
  const [layout, setLayout] = useState<keyof typeof Layout>(Layout.vertical);

  const {
    gapi,
    isSignIn,
  } = useGapiContext();

  const {
    params,
    handleChangeParams
  } = useQuery<DocumentQuery>({
    search: '',
    pageSize: userConfig.PAGE_LIMIT,
    order: ORDER.ASC,
    orderBy: ORDER_BY.RECENCY,
  })

  const {
    nextPageToken,
    files,
    isLoading,
    handleDownloadFile,
    handleLoadList,
  } = useFiles(params);

  const handleAuthClick = async () => gapi?.auth2.getAuthInstance().signIn();
  const handleSignOutClick = async () => gapi?.auth2.getAuthInstance().signOut();
  const handleChangeLayout = () => setLayout((layout) => layout === Layout.horizontal ? Layout.vertical : Layout.horizontal);


  if (!isSignIn) return (
    <div className={styles.picker}>
      <Auth handleClick={handleAuthClick} />
    </div>
  )
  return (
    <div className={styles.picker}>
      {isLoading && <Spinner isLoading isAbsolute withBlur />}
      <PageHeader
        title="Select a file"
        extra={[
          <Button type="primary" key='logoutBtn' onClick={handleSignOutClick}>Sign out</Button>
        ]}
      />
      <Filters
        layout={layout}
        params={params}
        handleChangeParams={handleChangeParams}
        handleChangeLayout={handleChangeLayout}
      />
      <ListComponent
        list={files}
        layout={layout}
        handleFileClick={handleDownloadFile}
      />
      {nextPageToken && (
        <div className={styles.picker__btn}>
          <Button
            onClick={() => handleLoadList(nextPageToken)}
            type='primary'
            icon={<RedoOutlined />}
          >
            Show more files
          </Button>
        </div>
      )}
    </div>
  )
};

export default Picker;