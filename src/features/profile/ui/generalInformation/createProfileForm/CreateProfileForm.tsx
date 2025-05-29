import { Avatar, Button, SelectBox, Separator, TextArea, TextField } from '@/shared/ui'
import s from './CreateProfileForm.module.scss'

export const CreateProfileForm = () => {
  return (
    <div className={s.container}>
      <div className={s.contentWrapper}>
        <div className={s.photoArea}>
          <Avatar size="large" />
          <Button>Add a Profile Photo</Button>
        </div>

        <form className={s.formArea} id="profileForm">
          <TextField label="Username" />
          <TextField label="First Name" />
          <TextField label="Last Name" />
          <TextField label="Date of Birth" />

          <div className={s.selectGroup}>
            <span>
              <label className={s.label}>Select your country</label>
              <SelectBox placeholder="Country" className={s.select} />
            </span>
            <span>
              <label className={s.label}>Select your city</label>
              <SelectBox placeholder="City" className={s.select} />
            </span>
          </div>
          <TextArea label="About Me" />
        </form>
      </div>
      <Separator />
      <Button type="submit" className={s.submitButton} form="profileForm">
        Save changes
      </Button>
    </div>
  )
}
