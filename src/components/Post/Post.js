// @flow
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Comments from './Comments';
import Content from './Content';
import styles from './Post.module.scss';
import EmailSignup from '../EmailSignup';
import type { Node } from '../../types';

type Props = {
  post: Node
};

const getScrollPercentage = () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  return (winScroll / height) * 100;
};

const Post = ({ post }: Props) => {
  const { html } = post;
  const { slug } = post.fields;
  const { title } = post.frontmatter;
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const updateScrollPercentage = () => {
    setScrollPercentage(getScrollPercentage());
  };

  useEffect(() => {
    document.addEventListener('scroll', updateScrollPercentage);

    return () => {
      document.removeEventListener('scroll', updateScrollPercentage);
    };
  }, []);

  return (
    <div className={styles['post']}>
      <div
        className={styles['post__progress']}
        style={{
          width: `${scrollPercentage}%`
        }}
      />
      <Link className={styles['post__home-button']} to="/">
        All Articles
      </Link>

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
