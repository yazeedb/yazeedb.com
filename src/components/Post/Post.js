// @flow
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'gatsby';
import Author from './Author';
import Comments from './Comments';
import Content from './Content';
import Meta from './Meta';
import Tags from './Tags';
import styles from './Post.module.scss';
import EmailSignup from '../EmailSignup';
import type { Node } from '../../types';

type Props = {
  post: Node
};

const Post = ({ post }: Props) => {
  const { html } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;
  const footerRef = useRef(null);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    if (!footerRef.current) {
      return;
    }

    const hideArticlesButtonIfFooterVisible = () => {
      const footerHeight = footerRef.current.offsetHeight;
      const top = footerRef.current.getBoundingClientRect().top;

      setFooterVisible(footerHeight - top > 0);
    };

    document.addEventListener('scroll', hideArticlesButtonIfFooterVisible);

    return () => {
      document.removeEventListener('scroll', hideArticlesButtonIfFooterVisible);
    };
  }, [footerRef.current]);

  return (
    <div className={styles['post']}>
      {!footerVisible && (
        <Link className={styles['post__home-button']} to="/">
          All Articles
        </Link>
      )}

      <div className={styles['post__content']}>
        <Content body={html} title={title} />
      </div>

      <div className={styles['post__footer']} ref={footerRef}>
        <EmailSignup />
      </div>

      <div className={styles['post__comments']}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
