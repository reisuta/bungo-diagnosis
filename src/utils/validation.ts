// データ検証とセキュリティ関連のユーティリティ関数

export interface StageData {
  score: number;
  answers: Record<string, string>;
  isGeneral?: boolean;
  stage1Score?: number;
  stage2Score?: number;
}

export interface Stage3Answers {
  ques1?: string;
  ques2?: string;
  ques3?: string;
  ques4?: string;
  ques5?: string;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * 段階データの検証
 */
export function validateStageData(stage: number, data: unknown): data is StageData {
  if (!data || typeof data !== 'object' || data === null) {
    throw new ValidationError('Invalid stage data format', 'data', data)
  }

  const stageData = data as Record<string, unknown>

  // score の検証
  if (typeof stageData.score !== 'number' || isNaN(stageData.score)) {
    throw new ValidationError('Invalid score value', 'score', stageData.score)
  }

  // スコア範囲の検証（0-50の範囲を想定）
  if (stageData.score < 0 || stageData.score > 50) {
    throw new ValidationError('Score out of valid range (0-50)', 'score', stageData.score)
  }

  // answers の検証
  if (!stageData.answers || typeof stageData.answers !== 'object') {
    throw new ValidationError('Invalid answers format', 'answers', stageData.answers)
  }

  const answers = stageData.answers as Record<string, unknown>

  // Stage 3の場合、5つの質問の回答が必要
  if (stage === 3) {
    const requiredQuestions = ['ques1', 'ques2', 'ques3', 'ques4', 'ques5']
    for (const question of requiredQuestions) {
      if (!(question in answers)) {
        throw new ValidationError(`Missing required question: ${question}`, 'answers', answers)
      }

      const answerValue = answers[question]
      if (typeof answerValue !== 'string') {
        throw new ValidationError(`Invalid answer type for ${question}`, question, answerValue)
      }

      // 回答値の検証（想定される値: '0', '3', '5', '7', '10'）
      const validAnswers = ['0', '3', '5', '7', '10']
      if (!validAnswers.includes(answerValue as string)) {
        throw new ValidationError(`Invalid answer value for ${question}`, question, answerValue)
      }
    }
  }

  // Stage 3 の場合、他の段階のデータも必要
  if (stage === 3) {
    if (typeof stageData.stage1Score !== 'number' || isNaN(stageData.stage1Score)) {
      throw new ValidationError('Invalid stage1Score', 'stage1Score', stageData.stage1Score)
    }

    if (typeof stageData.stage2Score !== 'number' || isNaN(stageData.stage2Score)) {
      throw new ValidationError('Invalid stage2Score', 'stage2Score', stageData.stage2Score)
    }

    if (typeof stageData.isGeneral !== 'boolean') {
      throw new ValidationError('Invalid isGeneral value', 'isGeneral', stageData.isGeneral)
    }

    // スコア範囲の検証
    if (stageData.stage1Score < 0 || stageData.stage1Score > 50) {
      throw new ValidationError('Stage1 score out of valid range', 'stage1Score', stageData.stage1Score)
    }

    if (stageData.stage2Score < 0 || stageData.stage2Score > 50) {
      throw new ValidationError('Stage2 score out of valid range', 'stage2Score', stageData.stage2Score)
    }
  }

  return true
}

/**
 * Stage3Answers の検証
 */
export function validateStage3Answers(answers: unknown): answers is Stage3Answers {
  if (!answers || typeof answers !== 'object') {
    return false
  }

  const stage3Answers = answers as Record<string, unknown>
  const validAnswers = ['0', '3', '5', '7', '10']

  for (const key of Object.keys(stage3Answers)) {
    if (!key.startsWith('ques')) {
      return false
    }

    const value = stage3Answers[key]
    if (value !== undefined && (typeof value !== 'string' || !validAnswers.includes(value))) {
      return false
    }
  }

  return true
}

/**
 * セッションストレージデータの整合性チェック
 */
export function validateSessionIntegrity(): boolean {
  try {
    // 各段階のデータが存在し、整合性があるかチェック
    const stage1Raw = sessionStorage.getItem('stage1')
    const stage2Raw = sessionStorage.getItem('stage2')
    const stage3Raw = sessionStorage.getItem('stage3')

    if (!stage1Raw || !stage2Raw || !stage3Raw) {
      return false
    }

    const stage1Data = JSON.parse(stage1Raw)
    const stage2Data = JSON.parse(stage2Raw)
    const stage3Data = JSON.parse(stage3Raw)

    // 基本的な整合性チェック
    validateStageData(1, stage1Data)
    validateStageData(2, stage2Data)
    validateStageData(3, stage3Data)

    // スコアの継承関係チェック
    if (stage3Data.stage1Score !== stage1Data.score) {
      throw new ValidationError('Stage1 score mismatch', 'stage1Score', stage3Data.stage1Score)
    }

    if (stage3Data.stage2Score !== stage2Data.score) {
      throw new ValidationError('Stage2 score mismatch', 'stage2Score', stage3Data.stage2Score)
    }

    if (stage3Data.isGeneral !== stage2Data.isGeneral) {
      throw new ValidationError('isGeneral flag mismatch', 'isGeneral', stage3Data.isGeneral)
    }

    return true
  } catch (error) {
    console.warn('Session integrity validation failed:', error)
    return false
  }
}

/**
 * 安全なセッションデータ取得
 */
export function getValidatedStageData(stage: number): StageData | null {
  try {
    const rawData = sessionStorage.getItem(`stage${stage}`)
    if (!rawData) {
      return null
    }

    const data = JSON.parse(rawData)

    if (validateStageData(stage, data)) {
      return data as StageData
    }

    return null
  } catch (error) {
    console.warn(`Failed to get validated stage${stage} data:`, error)
    return null
  }
}

/**
 * セッションデータのサニタイズ
 */
export function sanitizeStageData(data: StageData): StageData {
  return {
    score: Math.max(0, Math.min(50, Math.floor(data.score))),
    answers: Object.fromEntries(
      Object.entries(data.answers).map(([key, value]) => [
        key.replace(/[^a-zA-Z0-9]/g, ''), // キーのサニタイズ
        ['0', '3', '5', '7', '10'].includes(value) ? value : '0' // 値のサニタイズ
      ])
    ),
    isGeneral: Boolean(data.isGeneral),
    stage1Score: data.stage1Score ? Math.max(0, Math.min(50, Math.floor(data.stage1Score))) : undefined,
    stage2Score: data.stage2Score ? Math.max(0, Math.min(50, Math.floor(data.stage2Score))) : undefined
  }
}

/**
 * 診断実行前の最終検証
 */
export function validateDiagnosisInputs(
  stage1Score: number,
  stage2Score: number,
  stage3Score: number,
  isGeneral: boolean,
  stage3Answers?: Stage3Answers
): boolean {
  // スコア範囲の検証
  if (
    stage1Score < 0 || stage1Score > 50 ||
    stage2Score < 0 || stage2Score > 50 ||
    stage3Score < 0 || stage3Score > 50
  ) {
    return false
  }

  // 型の検証
  if (
    typeof stage1Score !== 'number' ||
    typeof stage2Score !== 'number' ||
    typeof stage3Score !== 'number' ||
    typeof isGeneral !== 'boolean'
  ) {
    return false
  }

  // NaN チェック
  if (
    isNaN(stage1Score) ||
    isNaN(stage2Score) ||
    isNaN(stage3Score)
  ) {
    return false
  }

  // Stage3Answers の検証
  if (stage3Answers && !validateStage3Answers(stage3Answers)) {
    return false
  }

  return true
}
