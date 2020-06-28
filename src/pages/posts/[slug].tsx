import React from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import IBlogPost from '../../models/IBlogPost';
import BloggerService from '../../service/BloggerService';
import BlogRedirectInfo from '../../components/BlogRedirectInfo';
import BlogPost from '../../components/BlogPost';
import styles from '../../App.module.css';

interface IServerProps {
  post: IBlogPost
}

export default (props: IServerProps) => {
  return (
    <>
      <BlogRedirectInfo path='' />
      <div className={styles['App-Container']}>
        <BlogPost post={props.post} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async() => {
  const bloggerPosts = await BloggerService.getAllPosts();
  const paths = bloggerPosts.posts.map(post => {
    const end = post.postUrl.length - 5;
    return {
      params: {
        slug: post.postUrl.substring(28, end)
      }
    }
  });

  console.info(paths)
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async(context: GetStaticPropsContext<any>) => {
  const slug = context?.params?.slug ?? 'na'
  const bloggerPosts = await BloggerService.getAllPosts();

  const post = bloggerPosts.posts.find( post => post.postUrl.includes(slug))
  return {
    props: {
      post
    }
  }
} 