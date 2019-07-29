// @flow
import React from 'react';
import Helmet from 'react-helmet';
import type { Node as ReactNode } from 'react';
import styles from './Layout.module.scss';

type Props = {
  children: ReactNode,
  title: string,
  description?: string,
  siteUrl: string,
  coverImageUrl: string
};

const Layout = ({
  children,
  title,
  description,
  siteUrl,
  coverImageUrl
}: Props) => {
  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={coverImageUrl ? siteUrl + coverImageUrl : null}
        />
        <meta name="twitter:creator" content="Yazeed Bzadough" />
      </Helmet>
      {children}
    </div>
  );
};

export default Layout;
