// クライアントサイドで診断結果を保存・取得するための関数

import { validateStageData, sanitizeStageData, type StageData } from '../utils/validation'
import { DiagnosisError, DiagnosisErrorCode } from '../utils/errorHandling'

export function saveStageData(stage: number, data: Record<string, unknown>) {
  try {
    // データの検証
    if (!validateStageData(stage, data)) {
      throw new DiagnosisError(
        `Invalid data for stage ${stage}`,
        DiagnosisErrorCode.VALIDATION_FAILED,
        { stage, data }
      )
    }

    // データのサニタイズ
    const sanitizedData = sanitizeStageData(data as StageData)

    sessionStorage.setItem(`stage${stage}`, JSON.stringify(sanitizedData))
  } catch (error) {
    console.error('Failed to save stage data:', error)
    throw error
  }
}

export function getStageData(stage: number): Record<string, unknown> | null {
  try {
    const data = sessionStorage.getItem(`stage${stage}`)
    if (!data) return null

    const parsedData = JSON.parse(data)

    // 取得したデータの検証
    if (!validateStageData(stage, parsedData)) {
      console.warn(`Invalid data found in stage${stage}, removing...`)
      sessionStorage.removeItem(`stage${stage}`)
      return null
    }

    return parsedData
  } catch (error) {
    console.error(`Failed to get stage${stage} data:`, error)
    // 破損したデータを削除
    sessionStorage.removeItem(`stage${stage}`)
    return null
  }
}

export function clearDiagnosisData() {
  try {
    sessionStorage.removeItem('stage1')
    sessionStorage.removeItem('stage2')
    sessionStorage.removeItem('stage3')
  } catch (error) {
    console.warn('Failed to clear diagnosis data:', error)
  }
}

export function calculateScore(formData: FormData, questions: string[]): number {
  let score = 0

  questions.forEach(q => {
    const value = formData.get(q) as string || '0'
    const numericValue = parseInt(value)

    // 数値の検証
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 10) {
      console.warn(`Invalid score value for ${q}: ${value}, using 0`)
      return // 0を加算（デフォルト）
    }

    score += numericValue
  })

  // 最終スコアの範囲制限
  return Math.max(0, Math.min(50, score))
}
