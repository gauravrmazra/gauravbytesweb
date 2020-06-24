import React, { useEffect } from 'react'
import App from '../App'
import { useDispatch } from 'react-redux'
import { getBloggerPosts } from '../redux/reducer/blogPostsSlice';

export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBloggerPosts())
  }, [dispatch])
  return (<App />)
}