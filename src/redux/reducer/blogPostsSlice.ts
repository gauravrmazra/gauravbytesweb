import IBlogPost from "../../models/IBlogPost";
import { SearchOnFields } from "../../models/SearchOnFields";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../redux/store';

interface BlogPostsState {
  showingPost: IBlogPost | null
  searchText: string
  selectedSearchOn: SearchOnFields
  searchResults: IBlogPost[]
  isSearch: boolean
  bloggerPosts: {
    allTags: string[],
    posts: IBlogPost[]
  }
  isLoadingBloggerPosts: boolean
  bloggerPostsError: any
}

// Initial state of the reducer
const initialState: BlogPostsState = {
  showingPost: null,
  searchText: '',
  selectedSearchOn: SearchOnFields.TAG,
  searchResults: [],
  isSearch: false,
  bloggerPosts: {
    allTags: [],
    posts: []
  },
  isLoadingBloggerPosts: false,
  bloggerPostsError: null
}

declare type BloggerEntry = {
  id: {
    $t: string
  },
  updated: {
    $t: string
  },
  published: {
    $t: string
  },
  category: Array<{scheme: string, term: string}>,
  title: {
    $t: string
  },
  summary: {
    $t: string
  },
  author: Array<{name: { $t: string }}>,
  link: Array<{ rel: string, href: string }>
}

export const getBloggerPosts = createAsyncThunk('blogggerPosts/all', async(thunkAPI) => {
  const response = await fetch('https://www.blogger.com/feeds/5554118637855932326/posts/summary?alt=json&start-index=1&max-results=100')
  const result = await response.json();
  const categories = result?.feed?.category ?? [];
  const allTags = (categories as Array<{term: string}>).map(category => category.term)
  const entries = result?.feed?.entry ?? [];
  const posts = (entries as Array<BloggerEntry>).map(entry => {
    const id = entry.id.$t;
    const datePublishedOrUpdated = entry.updated.$t || entry.published.$t;
    const tags = entry.category.map(cat => cat.term);
    const title = entry.title.$t;
    const content = entry.summary.$t;
    const author = entry.author.map(a => a.name.$t).join(', ')
    const postLink = entry.link.find(l => l.rel === 'alternate');
    const postUrl = !!postLink ? postLink.href : '';

    return {
      id,
      tags,
      title,
      content,
      author,
      postUrl,
      postedOn: datePublishedOrUpdated
    }
  })
  return { allTags, posts };
})

const findFirstPost = (posts: IBlogPost[]) : IBlogPost | null => !!posts && posts.length > 0 ? posts[0] : null;

const blogPostsSlice = createSlice({
  name: 'blogPosts',
  initialState,
  reducers: {
    setShowingPost: (state, action: PayloadAction<string>) => {
      const newShowingPost = state?.bloggerPosts.posts.find(post => post.id === action.payload) ?? undefined;
      state.showingPost = newShowingPost ?? null
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setSelectedSearchOn: (state, action: PayloadAction<SearchOnFields>) => {
      state.selectedSearchOn = action.payload;
    },
    onSearch: state => {
      const isMatched = (value: string) => value.toLowerCase().includes(state.searchText.toLowerCase());
      const filterPosts = (post: IBlogPost) => (state.selectedSearchOn === SearchOnFields.TITLE) ? isMatched(post.title) : post.tags.some(isMatched)
      state.isSearch = true;
      if (state.searchText !== '') {
        const posts = state.bloggerPosts.posts;
        const searchResults = posts.filter(filterPosts)
        state.searchResults = searchResults;
        state.showingPost = findFirstPost(searchResults);

      } else {
        state.searchResults = [];
        state.isSearch = false;
        state.showingPost = findFirstPost(state.bloggerPosts.posts)
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getBloggerPosts.pending, (state, _) => {
      state.isLoadingBloggerPosts = true;
    }).addCase(getBloggerPosts.rejected, (state, action) => {
      state.bloggerPostsError = action.error;
    }).addCase(getBloggerPosts.fulfilled, (state, action) => {
      state.isLoadingBloggerPosts = false;
      state.bloggerPosts = action.payload;
      state.showingPost = findFirstPost(state.bloggerPosts.posts)
    })
  }
});

const setShowingPostsAsync = (id: string) : AppThunk => dispatch => {
  setTimeout(() => {
    dispatch(setShowingPost(id))
  }, 500)
};

const onSearchAsync = (): AppThunk => dispatch => {
  setTimeout(() => {
    dispatch(onSearch())
  }, 200)
};

// List of selectors
const selectPosts = (state: RootState) => state.blogPosts.isSearch ? state.blogPosts.searchResults : (state.blogPosts?.bloggerPosts?.posts ?? []);

const selectShowingPost = (state: RootState) => state.blogPosts.showingPost;

const selectPostsForListing = (state: RootState) => state.blogPosts.isSearch ? listingPosts(state.blogPosts.searchResults): listingPosts((state.blogPosts?.bloggerPosts?.posts ?? []));

const selectShowingPostId = (state: RootState) => state.blogPosts?.showingPost?.id ?? 0;

const selectSearchText = (state: RootState) => state.blogPosts.searchText;

const selectSelectedSearchOn = (state: RootState) => state.blogPosts.selectedSearchOn;

const listingPosts = (posts: IBlogPost[]) => posts?.map(post => { return { id: post.id, title: post.title }}) ?? [];


const { setSearchText, setSelectedSearchOn, setShowingPost, onSearch } = blogPostsSlice.actions;

// Selector functions
export { selectPosts, selectShowingPost, selectPostsForListing, selectShowingPostId, selectSearchText, selectSelectedSearchOn }

// action functions
export { setShowingPostsAsync, onSearchAsync, setSearchText, setSelectedSearchOn, setShowingPost, onSearch }

export default blogPostsSlice.reducer;