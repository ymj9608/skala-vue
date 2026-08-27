<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../components/exercise/AppIcon.vue'
import {
  EDITING_POST_STORAGE_KEY,
  formatCommunityDate,
  loadCommunityData,
  saveCommunityData,
} from '../utils/communityStorage'

const router = useRouter()
const posts = ref([])
const ownedPostIds = ref([])

const loadPosts = () => {
  const savedData = loadCommunityData()
  posts.value = savedData.posts
  ownedPostIds.value = savedData.ownedPostIds
}

const canManagePost = (post) => ownedPostIds.value.includes(post.id)

const goToWrite = () => {
  sessionStorage.removeItem(EDITING_POST_STORAGE_KEY)
  router.push('/community/write')
}

const editPost = (post) => {
  if (!canManagePost(post)) {
    return
  }

  sessionStorage.setItem(EDITING_POST_STORAGE_KEY, post.id)
  router.push('/community/write')
}

const deletePost = (post) => {
  if (!canManagePost(post) || !window.confirm('이 게시글을 삭제할까요?')) {
    return
  }

  posts.value = posts.value.filter((item) => item.id !== post.id)
  ownedPostIds.value = ownedPostIds.value.filter((id) => id !== post.id)

  if (!saveCommunityData(posts.value, ownedPostIds.value)) {
    window.alert('게시글을 삭제하지 못했습니다.')
    loadPosts()
  }
}

onMounted(loadPosts)
</script>

<template>
  <main class="board-page">
    <section class="board-shell">
      <header class="board-header">
        <h1>날씨 이야기</h1>
        <button class="write-button" type="button" @click="goToWrite">
          <AppIcon name="write" :size="17" />
          글쓰기
        </button>
      </header>

      <div v-if="posts.length === 0" class="empty-board">
        <AppIcon name="community" :size="38" />
        <strong>등록된 게시글이 없습니다.</strong>
      </div>

      <div v-else class="post-list">
        <article v-for="post in posts" :key="post.id" class="post-item">
          <div class="post-main">
            <div class="post-author">{{ post.nickname.charAt(0) }}</div>
            <div class="post-text">
              <div class="post-title-line">
                <h2>{{ post.title }}</h2>
                <span v-if="canManagePost(post)" class="my-post">내 글</span>
              </div>
              <p>{{ post.content }}</p>
              <div class="post-meta">
                <strong>{{ post.nickname }}</strong>
                <time :datetime="post.updatedAt || post.createdAt">
                  {{ formatCommunityDate(post.updatedAt || post.createdAt) }}
                </time>
                <span v-if="post.updatedAt">수정됨</span>
              </div>
            </div>
          </div>

          <div v-if="canManagePost(post)" class="post-actions">
            <button type="button" @click="editPost(post)">수정</button>
            <button class="delete-button" type="button" @click="deletePost(post)">삭제</button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.board-page {
  width: min(1040px, 100%);
  min-height: 680px;
  margin: 0 auto;
}

.board-shell {
  overflow: hidden;
  border: 1px solid rgba(148, 202, 227, 0.82);
  border-radius: 18px;
  background-color: rgba(250, 253, 255, 0.97);
  box-shadow: 0 20px 50px rgba(0, 50, 84, 0.22);
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 30px 34px 24px;
  border-bottom: 1px solid #d8e8f0;
}

.board-header h1 {
  margin: 0;
  color: #073f69;
  font-size: 27px;
  font-weight: 850;
  letter-spacing: -1px;
}

.write-button {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 17px;
  border: 0;
  border-radius: 9px;
  background: linear-gradient(135deg, #075f91, #069dcc);
  color: white;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(4, 112, 163, 0.24);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.write-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 11px 23px rgba(4, 112, 163, 0.3);
}

.empty-board {
  display: grid;
  min-height: 440px;
  place-items: center;
  align-content: center;
  gap: 14px;
  color: #6d94a9;
}

.empty-board strong {
  color: #426d84;
  font-size: 15px;
}

.post-list {
  padding: 8px 34px 28px;
}

.post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 25px 4px;
  border-bottom: 1px solid #e0ebf1;
}

.post-item:last-child {
  border-bottom: 0;
}

.post-main {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 16px;
}

.post-author {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(145deg, #dff5ff, #bde6f7);
  color: #076994;
  font-size: 17px;
  font-weight: 900;
}

.post-text {
  min-width: 0;
}

.post-title-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
}

.post-title-line h2 {
  margin: 0;
  color: #113f5b;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.my-post {
  padding: 3px 7px;
  border-radius: 5px;
  background-color: #e4f6ef;
  color: #187354;
  font-size: 10px;
  font-weight: 800;
}

.post-text > p {
  display: -webkit-box;
  overflow: hidden;
  margin: 8px 0 10px;
  color: #547487;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 13px;
  align-items: center;
  color: #8ba0ac;
  font-size: 11px;
}

.post-meta strong {
  color: #517184;
  font-weight: 750;
}

.post-actions {
  display: flex;
  flex: 0 0 auto;
  gap: 7px;
}

.post-actions button {
  padding: 7px 11px;
  border: 1px solid #bdd4df;
  border-radius: 7px;
  background-color: white;
  color: #34708d;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.post-actions .delete-button {
  border-color: #eac9c4;
  color: #bd5749;
}
</style>
