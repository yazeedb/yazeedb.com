// @flow
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Author from './Author';
import Comments from './Comments';
import Content from './Content';
import Meta from './Meta';
import Tags from './Tags';
import styles from './Post.module.scss';
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
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;
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

  console.log({ scrollPercentage });

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

      <div className={styles['post__footer']}>
        <Meta date={date} />
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <Author />
      </div>

      <div className={styles['post__comments']}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
