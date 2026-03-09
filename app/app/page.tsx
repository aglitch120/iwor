import { redirect } from 'next/navigation'

// /app にアクセスしたら実際のアプリにリダイレクト
export default function AppPage() {
  redirect('/demo_v14_app.html')
}
