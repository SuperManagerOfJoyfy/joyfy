'use client'

import { Button, Card, Typography } from '@/shared/ui'
import Image from 'next/image'
import avatar from '../../../../../public/default-avatar.png'
import s from './publicPosts.module.scss'
import { Post } from '@/features/post/types/types'
import { formatNumberToSixDigits, timeAgo } from '@/features/main/utils'
import { useState } from 'react'
import clsx from 'clsx'

type Props = {
  count: number
  posts: Post[]
}

export const PublicPosts = ({ count, posts }: Props) => {
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: number) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <>
      <Card className={s.card}>
        <Typography as="h2" fontWeight="bold">
          Registered users:
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
              <Image
                src={post.images[0].url}
                width={post.images[0].width}
                height={post.images[0].height}
                className={clsx(s.img, isExpanded && s.imgSmall)}
                alt="post_img"
                priority
              />

              <div className={s.info}>
                <div className={s.owner}>
                  <Image
                    src={post.avatarOwner ?? avatar}
                    width={192}
                    height={192}
                    className={s.img}
                    alt="avatarOwner"
                  />

                  <Typography variant="h3" fontWeight="bold">
                    {post.userName}
                  </Typography>
                </div>

                <div className={s.time}>
                  <Typography className={s.text} variant="body2">
                    {timeAgo(post.createdAt)}
                  </Typography>
                </div>

                <div className={clsx(s.description, isExpanded && s.expanded)}>
                  <Typography as="span" variant="body2">
                    {visibleText}
                  </Typography>

                  {showButton && (
                    <Button variant="link" onClick={() => toggleExpand(post.id)} className={s.toggleBtn}>
                      <Typography as="span" variant="body2">
                        {isExpanded ? 'Hide' : 'Show more'}
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
