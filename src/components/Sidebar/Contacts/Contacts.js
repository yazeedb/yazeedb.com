import React from 'react';
import styles from './Contacts.module.scss';
import TwitterIcon from '../../Icons/Twitter';
import GitHubIcon from '../../Icons/GitHub';
import LinkedInIcon from '../../Icons/LinkedIn';
import YouTubeIcon from '../../Icons/YouTube';

const Contacts = () => (
  <div className={styles['contacts']}>
    <ul className={styles['contacts__list']}>
      <li className={styles['contacts__item']}>
        <a href="https://twitter.com/yazeedBee">
          <TwitterIcon />
        </a>
      </li>
      <li className={styles['contacts__item']}>
        <a href="https://github.com/yazeedb">
          <GitHubIcon />
        </a>
      </li>
      <li className={styles['contacts__item']}>
        <a href="https://www.linkedin.com/in/yazeedb/">
          <LinkedInIcon />
        </a>
      </li>
      <li className={styles['contacts__item']}>
        <a href="https://www.youtube.com/channel/UC9pYepHoYW9Hr_VLDrgLhRA">
          <YouTubeIcon />
        </a>
      </li>
    </ul>
  </div>
);

export default Contacts;
