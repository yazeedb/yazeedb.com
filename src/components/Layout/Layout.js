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
  const fullCoverImageUrl = coverImageUrl ? siteUrl + coverImageUrl : null;

  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* OG tags */}
        <meta property="og:site_name" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullCoverImageUrl} />

        {/* Twitter tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullCoverImageUrl} />
        <meta name="twitter:creator" content="Yazeed Bzadough" />
      </Helmet>
      {children}
    </div>
  );
};

export default Layout;
