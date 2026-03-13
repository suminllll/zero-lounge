import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const ACCESS_KEY = process.env.NCP_ACCESS_KEY!
const SECRET_KEY = process.env.NCP_SECRET_KEY!
const SERVICE_ID = process.env.NCP_SMS_SERVICE_ID!
const FROM_PHONE = process.env.NCP_FROM_PHONE!

function ncpHeaders(method: string, url: string) {
  const timestamp = Date.now().toString()
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${method} ${url}\n${timestamp}\n${ACCESS_KEY}`)
    .digest('base64')
  return {
    'Content-Type': 'application/json',
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': ACCESS_KEY,
    'x-ncp-apigw-signature-v2': signature,
  }
}

export async function POST(request: NextRequest) {
  if (!ACCESS_KEY || !SECRET_KEY || !SERVICE_ID || !FROM_PHONE) {
    return NextResponse.json({ error: 'SMS 환경변수가 설정되지 않았습니다' }, { status: 500 })
  }

  const { to, content } = await request.json()
  if (!to || !content) {
    return NextResponse.json({ error: '수신번호와 내용이 필요합니다' }, { status: 400 })
  }

  const sendPath = `/sms/v2/services/${SERVICE_ID}/messages`
  const res = await fetch(`https://sens.apigw.ntruss.com${sendPath}`, {
    method: 'POST',
    headers: ncpHeaders('POST', sendPath),
    body: JSON.stringify({
      type: 'LMS',
      contentType: 'COMM',
      countryCode: '82',
      from: FROM_PHONE,
      content,
      messages: [{ to: to.replace(/-/g, '') }],
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status })
  }

  return NextResponse.json({ success: true })
}
