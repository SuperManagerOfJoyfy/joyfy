'use client'

import clsx from 'clsx'

import { useState } from 'react'
import { formatNumberToSixDigits } from '@/features/main/utils'
import { Post } from '@/features/post/types/postTypes'
import { Link } from '@/i18n/navigation'
import { Avatar, Button, Card, DateStamp, ImageSlider, Typography } from '@/shared/ui'
import { PostModal } from '@/features/postModal/ui'
import { useTranslations } from 'next-intl'

import s from './publicPosts.module.scss'

type Props = {
  count: number
  posts: Post[]
}

export const PublicPosts = ({ count, posts }: Props) => {
  const t = useTranslations('dashboard')
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({})
  const [_, setIsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const openModalHandler = (postData: Post) => {
    setSelectedPost(postData)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  return (
    <>
      {selectedPost && (
        <PostModal
          initialPost={selectedPost}
          userProfile={{ userId: selectedPost.ownerId, userName: selectedPost.userName }}
          manageUrl={false}
          onClose={closeModal}
        />
      )}
      <Card className={s.card}>
        <Typography as="h2" fontWeight="bold">
          {t('registeredUsers')}
        </Typography>

        <div className={s.countUsersWrapper}>
          {formatNumberToSixDigits(count).map((n, i) => {
            return (
              <Typography key={i} variant="h2" fontWeight="bold" className={s.number}>
                {n}
              </Typography>
            )
          })}
        </div>
      </Card>

      <div className={s.postsWrapper}>
        {posts.map((post) => {
          const isExpanded = expandedPosts[post.id] ?? false

          const isLong = post.description.length > (isExpanded ? 240 : 100)
          const showButton = post.description.length > 100

          const visibleText = post.description.slice(0, isExpanded ? 240 : 100) + (isLong ? '...' : '')

          return (
            <div key={post.id} className={s.post}>
              <div onClick={() => openModalHandler(post)}>
                <ImageSlider
                  images={post.images.map(({ url }, index) => ({ src: url, alt: `Post image ${index + 1}` }))}
                  className={clsx(s.img, isExpanded && s.imgSmall)}
                  buttonClassName={s.arrow}
                  showPagination={false}
                />
              </div>

              <div className={s.info}>
                <div className={s.owner}>
                  <Avatar avatar={post.avatarOwner} name={post.userName} />

                  <Link className={s.userName} href={`/profile/${post.ownerId}`}>
                    <Typography variant="h3" fontWeight="bold">
                      {post.userName}
                    </Typography>
                  </Link>
                </div>

                <div className={s.time}>
                  <DateStamp date={post.createdAt} />
                </div>

                <div className={clsx(s.description, isExpanded && s.expanded)}>
                  <Typography as="span" variant="body2">
                    {visibleText}
                  </Typography>

                  {showButton && (
                    <Button variant="link" onClick={() => toggleExpand(post.id)} className={s.toggleBtn}>
                      <Typography as="span" variant="body2">
                        {isExpanded ? t('hide') : t('showMore')}
                      </Typography>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
