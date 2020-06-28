import React from 'react';
import { useRouter } from 'next/router';
import BlogRedirectInfo from '../components/BlogRedirectInfo';

export default function Custom404() {
  const router = useRouter();
  const path = router.asPath
  if (path.startsWith('/posts')) {
    return (
      <BlogRedirectInfo path={decodeURIComponent(path.substring(6)).substring(1).split('/')}/>
    )
  }

  if (path.endsWith('.html')) {
    router.push('/posts/' + encodeURIComponent(path.substring(1, path.length - 5)))
    return;
  }

  return (
    <BlogRedirectInfo path=''/>
  )
}