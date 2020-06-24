import React from 'react';
import styles from './BlogPosts.module.css';
import BlogListing from './BlogListing';
import BlogPost from './BlogPost';


function BlogPosts() {
  return (
    <div className={styles["blog-container"]}>
      <BlogListing/>
      <BlogPost/>
    </div>
  );
}

export default BlogPosts;