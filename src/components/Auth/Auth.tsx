import React from 'react';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import Gdrive from '../../assets/grive_icon.svg';
import styles from './Auth.module.css';


interface Props {
  handleClick: () => void;
}

const Auth: React.FC<Props> = (props) => {
  const { handleClick } = props;

  return (
    <div className={styles.auth}>
      <div className={styles.auth__imgContainer}>
        <img src={Gdrive} alt="googledrive icon" className={styles.auth__img} />
      </div>
      <div className={styles.auth__title}>Select Files from Google Drive</div>
      <div className={styles.auth__subtitle}>You need to authenticate with Google Drive.</div>
      <div className={styles.auth__subtitle}>We only extract images and never modify or delete them.</div>
      <Button
        className={styles.auth__btn}
        icon={<GoogleOutlined />}
        type='primary'
        size='large'
        onClick={handleClick}
      >
        Sign in with Google
      </Button>
      <div className={styles.auth__subtitle}>To disconnect from Google Drive click "Sign out" button in the menu.</div>
    </div>
  );
};

export default Auth;