// クライアントサイドで診断結果を保存・取得するための関数

export function saveStageData(stage: number, data: Record<string, any>) {
  sessionStorage.setItem(`stage${stage}`, JSON.stringify(data))
}

export function getStageData(stage: number): Record<string, any> | null {
  const data = sessionStorage.getItem(`stage${stage}`)
  return data ? JSON.parse(data) : null
}

export function clearDiagnosisData() {
  sessionStorage.removeItem('stage1')
  sessionStorage.removeItem('stage2')
  sessionStorage.removeItem('stage3')
}

export function calculateScore(formData: FormData, questions: string[]): number {
  let score = 0
  questions.forEach(q => {
    score += parseInt(formData.get(q) as string || '0')
  })
  return score
}