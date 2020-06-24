import React from 'react';
import { GetServerSideProps } from 'next';
import BlogRedirectInfo from '../components/BlogRedirectInfo';

interface IProps {
  path: string | string[]
}

export default (prop: IProps) => {
  return (
    <BlogRedirectInfo path={prop.path} />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = context.query['slug']
  return {
    props: {
      path
    }
  }
}