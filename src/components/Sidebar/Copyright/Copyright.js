// @flow
import React from 'react';
import moment from 'moment';
import styles from './Copyright.module.scss';

// type Props = {
//   copyright: string
// };

// const Copyright = ({ copyright }: Props) => (
const Copyright = () => (
  <div className={styles['copyright']}>
    {/* {copyright} */}© {moment().format('YYYY')} Copyright Yazeed Bzadough.
    All rights reserved.
  </div>
);

export default Copyright;
