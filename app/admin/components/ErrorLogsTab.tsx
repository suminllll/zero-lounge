'use client'

import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useErrorLogs } from '@/hooks/useErrorLogs'
import { Spinner } from './Spinner'

export function ErrorLogsTab() {
  const queryClient = useQueryClient()
  const { data: errorLogs = [], isLoading } = useErrorLogs(true)

  const clearErrorLogs = async () => {
    if (!confirm('모든 로그를 삭제할까요?')) return
    await supabase.from('error_logs').delete().neq('id', 0)
    queryClient.invalidateQueries({ queryKey: ['error_logs'] })
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#8F8781] text-xs">최근 에러 로그 (최대 100개)</p>
        {errorLogs.length > 0 && (
          <button
            onClick={clearErrorLogs}
            className="text-xs text-[#f87171] bg-[#2a2220] px-3 py-1.5 rounded-lg"
          >
            전체 삭제
          </button>
        )}
      </div>
      {isLoading ? (
        <Spinner />
      ) : errorLogs.length === 0 ? (
        <p className="text-center text-[#8F8781] text-sm pt-20">에러 로그가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2 pb-4">
          {errorLogs.map(log => (
            <div key={log.id} className="bg-[#2a2220] rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#f87171]/20 text-[#f87171] font-medium shrink-0">
                  {log.page}
                </span>
                <span className="text-[#8F8781] text-xs shrink-0">
                  {new Date(log.created_at).toLocaleString('ko-KR')}
                </span>
              </div>
              <p className="text-[#f5e2d4] text-sm mb-1">{log.message}</p>
              {log.stack && (
                <p className="text-[#8F8781] text-xs leading-5 break-all whitespace-pre-wrap mt-2 border-t border-[#3a3230] pt-2">
                  {log.stack}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
