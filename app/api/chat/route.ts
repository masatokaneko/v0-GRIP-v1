import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    // ダミー応答
    const answer = `${text}（サンプル応答）`

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
