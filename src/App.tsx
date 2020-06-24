import React from 'react';
import styles from './App.module.css';
import BlogPosts from './components/BlogPosts';
import BlogRedirectInfo from './components/BlogRedirectInfo';

function App() {
  return (
    <>
      <BlogRedirectInfo path={''} />
      <div className={styles['App-Container']}>
        <BlogPosts />
      </div>
    </>
  );
}

export default App;
