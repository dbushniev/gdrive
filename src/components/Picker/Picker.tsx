import React, { Key, useState, useRef } from 'react';
import { useGapiContext } from '../../lib/providers/GapiProvider';
import useFiles from '../../lib/hooks/useFiles';
import useQuery from '../../lib/hooks/useQuery';
import { DocumentQuery } from '../../lib/models/Document/DocumentQuery';
import userConfig from '../../config/user';
import { ORDER, ORDER_BY } from '../../config/order';
import ListComponent from '../List';
import Filters from '../Filters';
import { Button, PageHeader, Modal, Typography, Input } from 'antd';
import { RedoOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './Picker.module.css';
import { Layout } from '../../config/layout';
import Auth from '../Auth';
import Spinner from '../Spinner';
import useS3 from '../../lib/hooks/useS3';
import fileConvert from '../../lib/utils/fileConvert';
import GTextLogo from '../../assets/gdrive_text_icon.svg';
import getFileInfo from '../../lib/utils/getFileInfo';

const { confirm, info } = Modal;
const { Title } = Typography;

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

  const {
    s3Files,
    guid,
    isS3FilesLoading,
    uploadS3File,
  } = useS3();

  const inputRef = useRef<Input>(null);

  const showUploadModal = (fileId: Key, fileName: string) => {
    const isFileUpload = s3Files.find((s3File) => getFileInfo(s3File.Key).name === `${guid}/${fileName}`);
    return confirm({
      title: isFileUpload
        ? 'File with this name has already download, if tou want to upload this file, please input another file name'
        : 'Do you want to upload this file?',
      icon: <QuestionCircleOutlined />,
      content: <div>
        {isFileUpload && <div className={styles.input}><Input ref={inputRef} /></div>}
        <div>If you click "OK" button this file will be upload to your s3 bucket</div>
      </div>,
      centered: true,
      onOk: () => handleDownload(fileId, isFileUpload ? inputRef.current?.state.value : fileName),
    })
  };

  const showConfirmModal = (fileName: string) => info({
    title: (
      <div className={styles.info__header}>
        <img src={GTextLogo} alt="google drive" className={styles.info__img} />
      </div>
    ),
    content: <Title level={5} className={styles.info__title}>{`${fileName} \n successfully added to my files`}</Title>,
    icon: null,
    centered: true,
    okText: 'Done',
  });

  const handleAuthClick = async () => gapi?.auth2.getAuthInstance().signIn();
  const handleSignOutClick = async () => gapi?.auth2.getAuthInstance().signOut();
  const handleChangeLayout = () => setLayout((layout) => layout === Layout.horizontal ? Layout.vertical : Layout.horizontal);
  const handleDownload = async (fileId: Key, fileName: string) => {
    try {
      const byteString = await handleDownloadFile(fileId);
      if (byteString) {
        const { file, name } = fileConvert(byteString, fileName);
        await uploadS3File(file, name);
        showConfirmModal(fileName);
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (!isSignIn) return (
    <div className={`${styles.picker} ${styles._align}`}>
      <Auth handleClick={handleAuthClick} />
    </div>
  )
  return (
    <div className={styles.picker}>
      {(isLoading || isS3FilesLoading) && <Spinner isLoading isAbsolute withBlur />}
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
        s3Files={s3Files}
        layout={layout}
        handleFileClick={showUploadModal}
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