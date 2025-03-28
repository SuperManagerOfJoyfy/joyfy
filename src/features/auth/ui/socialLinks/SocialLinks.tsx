import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import s from './socialLinks.module.scss'
import Link from 'next/link'

export const SocialLinks = () => {
  // replace href with actual route
  return (
    <div className={s.iconsContainer}>
      <Link href="/auth">
        <FcGoogle className={s.icon} />
      </Link>
      <Link href="/auth">
        <FaGithub className={s.icon} />
      </Link>
    </div>
  )
}
