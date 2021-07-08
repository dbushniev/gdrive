import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './Spinner.module.css';
import classNames from 'classnames';
import { SpinProps } from 'antd/lib/spin';

export interface Props extends SpinProps {
  isLoading: boolean;
  isAbsolute?: boolean;
  withBlur?: boolean;
  iconClassName?: string;
}

const Spinner: React.FC<Props> = (props) => {
  const {
    isLoading,
    isAbsolute = false,
    withBlur = false,
    iconClassName = '',
    ...rest
  } = props;

  if(!isLoading) return null;
  const antIcon = <LoadingOutlined className={`${styles.spinnerIcon} ${iconClassName}`} spin />;

  return (
    <div className={classNames(styles.spinner__container, { [styles._absolute]: isAbsolute, [styles._blur]: withBlur })}>
      <Spin {...rest} className={styles.spinner} indicator={antIcon}/>
    </div>
  );
};

export default Spinner;
