import React from 'react';
import styles from '../App.module.css';
import { isString } from 'util';

interface IProps {
  path: string | string[]
 }
 
 export default function BlogRedirectInfo(prop: IProps) {
   function isValidPostUrl(paths: string[]): boolean {
     return paths.length === 3
       && !!paths[0].match(/[0-9]$/g)
       && !!paths[1].match(/[0-9]$/g)
       && paths[2].endsWith('.html')
   }
   function newPostUrl(paths: string[]): string {
     if (isValidPostUrl(paths)) {
       return `https://www.codefoundry.dev/${paths.join('/')}`;
     }
     return `https://www.codefoundry.dev/search?q=${paths.join(',')}&max-results=20&by-date=true`
   }
 
   function newSearch(keyword: string) {
     return `https://www.codefoundry.dev/search?q=${keyword}&max-results=20&by-date=true`
   }
   const url = isString(prop.path) ? newSearch(prop.path as string) : newPostUrl(prop.path as Array<string>);
   
   return (
     <>
       <div className={styles['container']}>
         <div className={styles['big-box']}>
           <h1 className={styles['big-box-title']}>Hello Reader!</h1>
           <p className={styles['big-box-p']}>We have made changes to our site!</p>
           <p className={styles['big-box-p']}><code className={styles['code']}>https://gauravbytes.com</code> is now <a className={styles['big-box-a']} href="https://www.codefoundry.dev"><code className={styles['code']}>https://codefoundry.dev</code></a></p>
           {!!prop.path && <hr className={styles['big-box-hr']} />}
           {!!prop.path && <p>The new url to see this post is: <a className={styles['big-box-a']} href={url}><code className={styles['code-r']}>{url}</code></a></p>}
         </div>
       </div>
     </>
   )
 }