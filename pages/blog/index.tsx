import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'
import process from 'process'
import { useRouter } from 'next/router'
import preview from '../api/preview'
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const Blog = ({ posts }) => {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        {/* <Spinner size={48} /> */}
      </Pane>
    )
  }

  return (
    <Container>
      {isBrowser && "browser"}
      {isMobile && "mobile"}
      <BrowserView>
        <h1 style={{color: 'green'}}> This is rendered only in browser </h1>
      </BrowserView>
      <MobileView>
        <h1> This is rendered only on mobile </h1>
      </MobileView>
      {posts.map((post) => (
        <Pane key={post.title} marginY={majorScale(5)}>
          <PostPreview post={post} />
        </Pane>
      ))}
    </Container>
  )
}

Blog.defaultProps = {
  posts: [],
}
/**
 * Need to get the posts from the
 * fs and our CMS
 */

// // This function gets called at build time
// export async function getStaticPaths() {
//   // Call an external API endpoint to get posts

//   // Get the paths we want to pre-render based on posts
//   const postsDirectory = path.join(process.cwd(), 'posts')
//   const filenames = fs.readdirSync(postsDirectory)
//   console.log('filenames', filenames)
//   const paths = filenames.map((name) => ({ params: { slug: name.replace('.mdx', '') } }))

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: true }
// }

export async function getStaticProps(context) {
  // read the posts dir from the fs
  const { preview } = context
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)
  // get each post from the fs
  const filePosts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    return fs.readFileSync(filePath, 'utf8')
  })

  // merge our posts from our CMS and fs then sort by pub date
  const posts = orderby(
    [...(preview ? postsFromCMS.draft : postsFromCMS.published), ...filePosts].map((content) => {
      // extract frontmatter from markdown content
      const { data } = matter(content)
      return data
    }),
    ['publishedOn'],
    ['desc'],
  )

  return { props: { posts } }
}

export default Blog
