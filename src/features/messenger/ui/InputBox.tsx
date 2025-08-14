import { Button, TextArea } from '@/shared/ui'
import s from './InputBox.module.scss'

export const InputBox = () => {
  return (
    <div className={s.inputBox}>
      <TextArea placeholder="Type message..." textAreaClassName={s.messageInput} wrapperClassName={s.inputWrapper} />
      <Button variant="text" className={s.inputButton}>
        Send message
      </Button>
    </div>
  )
}
