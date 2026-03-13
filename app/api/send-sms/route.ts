import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const ACCESS_KEY = process.env.NCP_ACCESS_KEY!
const SECRET_KEY = process.env.NCP_SECRET_KEY!
const SERVICE_ID = process.env.NCP_SMS_SERVICE_ID!
const FROM_PHONE = process.env.NCP_FROM_PHONE!

function makeSignature(timestamp: string): string {
  const url = `/sms/v2/services/${SERVICE_ID}/messages`
  const message = `POST ${url}\n${timestamp}\n${ACCESS_KEY}`
  return crypto.createHmac('sha256', SECRET_KEY).update(message).digest('base64')
}

export async function POST(request: NextRequest) {
  if (!ACCESS_KEY || !SECRET_KEY || !SERVICE_ID || !FROM_PHONE) {
    return NextResponse.json({ error: 'SMS 환경변수가 설정되지 않았습니다' }, { status: 500 })
  }

  const { to, content } = await request.json()
  if (!to || !content) {
    return NextResponse.json({ error: '수신번호와 내용이 필요합니다' }, { status: 400 })
  }

  const timestamp = Date.now().toString()

  const res = await fetch(
    `https://sens.apigw.ntruss.com/sms/v2/services/${SERVICE_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': ACCESS_KEY,
        'x-ncp-apigw-signature-v2': makeSignature(timestamp),
      },
      body: JSON.stringify({
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: FROM_PHONE,
        content,
        messages: [{ to: to.replace(/-/g, '') }],
      }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status })
  }
  return NextResponse.json({ success: true, data })
}
