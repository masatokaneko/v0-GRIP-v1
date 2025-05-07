import { redirect } from "next/navigation"

export default function RootPage() {
  // ホーム画面へ転送
  redirect("/home")
}
