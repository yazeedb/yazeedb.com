// @flow
import React, { useState, useEffect, useRef } from 'react';
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
  const footerRef = useRef(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const handleOnScroll = () => {
    setScrollPercentage(getScrollPercentage());

    if (footerRef) {
      const { top, height } = footerRef.current.getBoundingClientRect();

      setFooterVisible(top - height <= 0);
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', handleOnScroll);

    return () => {
      document.removeEventListener('scroll', handleOnScroll);
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
