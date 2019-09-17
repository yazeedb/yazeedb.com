// @flow
import React from 'react';
import styles from './Contacts.module.scss';
import TwitterIcon from '../../Icons/Twitter';
import GitHubIcon from '../../Icons/GitHub';
import LinkedInIcon from '../../Icons/LinkedIn';
import YouTubeIcon from '../../Icons/YouTube';

type Props = {
  contacts: {
    [string]: string
  }
};

const Contacts = ({ contacts }: Props) => (
  <div className={styles['contacts']}>
    <ul className={styles['contacts__list']}>
      <li>
        <TwitterIcon />
      </li>
      <li>
        <GitHubIcon />
      </li>
      <li>
        <LinkedInIcon />
      </li>
      <li>
        <YouTubeIcon />
      </li>
    </ul>
  </div>
);

export default Contacts;
