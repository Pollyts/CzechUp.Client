'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function LocaleHomePage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')

    // Проверяем, что пользователь на корневом пути языка
    const isRootLocalePath = /^\/(ru|en|cs)?$/.test(pathname)

    if (isRootLocalePath) {
      if (!token) {
        router.replace('/signin')
      } else {
        router.replace('/words')
      }
    }
  }, [pathname, router])

  return null // Пустая страница — сразу редиректим
}
