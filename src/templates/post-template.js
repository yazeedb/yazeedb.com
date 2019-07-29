import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { useSiteMetadata } from '../hooks';
import type { MarkdownRemark } from '../types';

type Props = {
  data: MarkdownRemark
};

const PostTemplate = ({ data }: Props) => {
  const {
    url: siteUrl,
    title: siteTitle,
    subtitle: siteSubtitle
  } = useSiteMetadata();
  const {
    title: postTitle,
    description: postDescription,
    coverImageUrl
  } = data.markdownRemark.frontmatter;
  const metaDescription =
    postDescription !== null ? postDescription : siteSubtitle;

  return (
    <Layout
      siteUrl={siteUrl}
      title={`${postTitle} - ${siteTitle}`}
      description={metaDescription}
      coverImageUrl={coverImageUrl}
    >
      <Post post={data.markdownRemark} />
    </Layout>
  );
};

export const query = graphql`
  query PostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
        tagSlugs
      }
      timeToRead
      frontmatter {
        date
        description
        tags
        title
        coverImageUrl
      }
    }
  }
`;

export default PostTemplate;
