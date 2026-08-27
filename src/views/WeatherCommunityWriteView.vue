<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  EDITING_POST_STORAGE_KEY,
  createPrivateId,
  loadCommunityData,
  saveCommunityData,
} from '../utils/communityStorage'

const router = useRouter()
const posts = ref([])
const ownedPostIds = ref([])
const editingPostId = ref('')
const nickname = ref('')
const title = ref('')
const content = ref('')
const formMessage = ref('')

const pageTitle = computed(() => (editingPostId.value ? '날씨 이야기 수정' : '날씨 이야기 작성'))
const submitLabel = computed(() => (editingPostId.value ? '수정 완료' : '등록'))

const goToList = () => {
  sessionStorage.removeItem(EDITING_POST_STORAGE_KEY)
  router.push('/community')
}

const submitPost = () => {
  if (nickname.value === '' || title.value === '' || content.value === '') {
    formMessage.value = '닉네임, 제목, 내용을 모두 입력해 주세요.'
    return
  }

  if (editingPostId.value) {
    const post = posts.value.find((item) => item.id === editingPostId.value)

    if (post && ownedPostIds.value.includes(post.id)) {
      post.nickname = nickname.value
      post.title = title.value
      post.content = content.value
      post.updatedAt = new Date().toISOString()
    }
  } else {
    const postId = createPrivateId()
    posts.value.unshift({
      id: postId,
      nickname: nickname.value,
      title: title.value,
      content: content.value,
      createdAt: new Date().toISOString(),
      updatedAt: '',
    })
    ownedPostIds.value.push(postId)
  }

  const isSaved = saveCommunityData(posts.value, ownedPostIds.value)

  if (!isSaved) {
    formMessage.value = '게시글을 저장하지 못했습니다.'
    return
  }

  goToList()
}

onMounted(() => {
  const savedData = loadCommunityData()
  posts.value = savedData.posts
  ownedPostIds.value = savedData.ownedPostIds
  editingPostId.value = sessionStorage.getItem(EDITING_POST_STORAGE_KEY) || ''

  if (!editingPostId.value) {
    return
  }

  const post = posts.value.find((item) => item.id === editingPostId.value)

  if (!post || !ownedPostIds.value.includes(post.id)) {
    editingPostId.value = ''
    sessionStorage.removeItem(EDITING_POST_STORAGE_KEY)
    return
  }

  nickname.value = post.nickname
  title.value = post.title
  content.value = post.content
})
</script>

<template>
  <main class="write-page">
    <form class="write-shell" @submit.prevent="submitPost">
      <header class="write-header">
        <h1>{{ pageTitle }}</h1>
        <button type="button" @click="goToList">목록</button>
      </header>

      <div class="form-field">
        <label for="community-nickname">닉네임</label>
        <input
          id="community-nickname"
          v-model="nickname"
          type="text"
          maxlength="20"
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <div class="form-field">
        <label for="community-title">제목</label>
        <input
          id="community-title"
          v-model="title"
          type="text"
          maxlength="60"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div class="form-field">
        <label for="community-content">내용</label>
        <textarea
          id="community-content"
          v-model="content"
          rows="14"
          maxlength="500"
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <p v-if="formMessage" class="form-message">{{ formMessage }}</p>

      <footer class="form-actions">
        <button class="cancel-button" type="button" @click="goToList">취소</button>
        <button class="submit-button" type="submit">{{ submitLabel }}</button>
      </footer>
    </form>
  </main>
</template>

<style scoped>
.write-page {
  width: min(860px, 100%);
  min-height: 680px;
  margin: 0 auto;
}

.write-shell {
  overflow: hidden;
  padding: 0 38px 34px;
  border: 1px solid rgba(148, 202, 227, 0.82);
  border-radius: 18px;
  background-color: rgba(250, 253, 255, 0.98);
  box-shadow: 0 20px 50px rgba(0, 50, 84, 0.22);
}

.write-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 27px;
  padding: 29px 0 23px;
  border-bottom: 1px solid #d8e8f0;
}

.write-header h1 {
  margin: 0;
  color: #073f69;
  font-size: 26px;
  font-weight: 850;
  letter-spacing: -1px;
}

.write-header button,
.cancel-button {
  padding: 9px 14px;
  border: 1px solid #b9d2df;
  border-radius: 8px;
  background-color: white;
  color: #356f8b;
  font-weight: 750;
  cursor: pointer;
}

.form-field + .form-field {
  margin-top: 20px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  color: #2e5d76;
  font-size: 13px;
  font-weight: 800;
}

.form-field input,
.form-field textarea {
  width: 100%;
  border: 1px solid #b7cfdb;
  border-radius: 9px;
  outline: none;
  background-color: white;
  color: #173f56;
  font-size: 14px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.form-field input {
  height: 46px;
  padding: 0 14px;
}

.form-field textarea {
  padding: 14px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.7;
}

.form-field input:focus,
.form-field textarea:focus {
  border-color: #1498c9;
  box-shadow: 0 0 0 3px rgba(20, 152, 201, 0.13);
}

.form-message {
  margin: 14px 0 0;
  color: #bf5144;
  font-size: 12px;
  font-weight: 750;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid #e0ebf1;
}

.cancel-button,
.submit-button {
  min-width: 82px;
}

.submit-button {
  padding: 10px 17px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #075f91, #079fce);
  color: white;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(4, 112, 163, 0.22);
  cursor: pointer;
}
</style>
