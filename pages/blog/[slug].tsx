import React, { FC } from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Post } from '../../types'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import renderToString from 'next-mdx-remote/render-to-string'
import { posts as postsFromCMS } from '../../content'
import doNotUseLayout from '../../utils/no_layout'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source)
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Container>
      <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
        {frontMatter.title}
      </Heading>
      <Pane>{content}</Pane>
    </Container>

  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts

  // Get the paths we want to pre-render based on posts
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)
  const slugs = filenames.map(name => {
    const filePath = path.join(postsDirectory, name)
    const file = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(file)
    // console.log('data\r', data)
    return data
  })

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.

  return {
    paths: slugs.map(s => ({ params: { slug: s.slug } })),
    // true: if the slug is new added, will pass it in getStaticProps and to do the requst. If successful, will cached
    // false: will return 404 page
    fallback: true,

  }
}

export async function getStaticProps({ params, preview }) {
  let postFile
  let { slug } = params
  console.log('slug', params)
  try {
    const postPath = path.join(process.cwd(), 'posts', `${slug}.mdx`)
    postFile = fs.readFileSync(postPath, 'utf-8')
  } catch {
    postFile = (preview ? postsFromCMS.draft : postsFromCMS.published).find(p => {
      const { data } = matter(p)
      return data.slug === slug
    })
  }

  if (!postFile) {
    throw new Error("no post")
  }

  console.log('postFile', postFile)
  const { content, data } = matter(postFile)
  const mdxSource = await renderToString(content, { scope: data })
  console.log('mdxSource', mdxSource)
  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    }
  }
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */
export default doNotUseLayout(BlogPost)


