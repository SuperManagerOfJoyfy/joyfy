'use client'

import { Button, Modal } from '@/shared/UI_temp'
import { useState } from 'react'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Відкрити модальне вікно</Button>
      <Modal open={open} onOpenChange={setOpen} title="Модальне вікно">
        <div style={{ padding: '20px' }}>
          <p>Тестовий контент модального вікна.</p>
          <Button onClick={() => setOpen(false)}>Закрити</Button>
        </div>
      </Modal>
    </div>
  )
}

export default App
