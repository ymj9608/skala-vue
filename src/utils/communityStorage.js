export const POSTS_STORAGE_KEY = 'sws-community-posts'
export const OWNED_POSTS_STORAGE_KEY = 'sws-community-owned-posts'
export const EDITING_POST_STORAGE_KEY = 'sws-community-editing-post'

const isValidPost = (post) => {
  return (
    post !== null &&
    typeof post === 'object' &&
    typeof post.id === 'string' &&
    typeof post.nickname === 'string' &&
    post.nickname.length <= 20 &&
    typeof post.title === 'string' &&
    post.title.length <= 60 &&
    typeof post.content === 'string' &&
    post.content.length <= 500 &&
    typeof post.createdAt === 'string' &&
    typeof post.updatedAt === 'string'
  )
}

export const loadCommunityData = () => {
  try {
    const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY)
    const savedOwnedPostIds = localStorage.getItem(OWNED_POSTS_STORAGE_KEY)
    const parsedPosts = savedPosts ? JSON.parse(savedPosts) : []
    const parsedOwnedPostIds = savedOwnedPostIds ? JSON.parse(savedOwnedPostIds) : []

    return {
      posts: Array.isArray(parsedPosts) ? parsedPosts.filter(isValidPost) : [],
      ownedPostIds: Array.isArray(parsedOwnedPostIds)
        ? parsedOwnedPostIds.filter((id) => typeof id === 'string')
        : [],
    }
  } catch {
    return {
      posts: [],
      ownedPostIds: [],
    }
  }
}

export const saveCommunityData = (posts, ownedPostIds) => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts))
    localStorage.setItem(OWNED_POSTS_STORAGE_KEY, JSON.stringify(ownedPostIds))
    return true
  } catch {
    return false
  }
}

export const createPrivateId = () => {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }

  return String(Date.now()) + String(Math.random()).slice(2)
}

export const formatCommunityDate = (dateText) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateText))
}
