// エラーハンドリングとユーザーフィードバック関連のユーティリティ

export enum DiagnosisErrorCode {
  INVALID_SESSION_DATA = 'INVALID_SESSION_DATA',
  MISSING_STAGE_DATA = 'MISSING_STAGE_DATA',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INTEGRITY_CHECK_FAILED = 'INTEGRITY_CHECK_FAILED',
  DIAGNOSIS_CALCULATION_FAILED = 'DIAGNOSIS_CALCULATION_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class DiagnosisError extends Error {
  constructor(
    message: string,
    public code: DiagnosisErrorCode,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'DiagnosisError'
  }
}

export interface ErrorRecoveryOptions {
  canRetry: boolean;
  suggestedAction: string;
  redirectUrl?: string;
}

/**
 * エラーコードに基づく日本語メッセージの取得
 */
export function getErrorMessage(error: DiagnosisError): string {
  switch (error.code) {
    case DiagnosisErrorCode.INVALID_SESSION_DATA:
      return '診断データに問題があります。最初からやり直してください。'

    case DiagnosisErrorCode.MISSING_STAGE_DATA:
      return '診断の進行状況が見つかりません。最初からやり直してください。'

    case DiagnosisErrorCode.VALIDATION_FAILED:
      return '入力データに不正な値が含まれています。正しく回答してください。'

    case DiagnosisErrorCode.INTEGRITY_CHECK_FAILED:
      return '診断データの整合性に問題があります。最初からやり直してください。'

    case DiagnosisErrorCode.DIAGNOSIS_CALCULATION_FAILED:
      return '診断結果の計算中にエラーが発生しました。もう一度お試しください。'

    case DiagnosisErrorCode.UNKNOWN_ERROR:
    default:
      return '予期しないエラーが発生しました。しばらく待ってからもう一度お試しください。'
  }
}

/**
 * エラーに対する復旧オプションの取得
 */
export function getRecoveryOptions(error: DiagnosisError): ErrorRecoveryOptions {
  switch (error.code) {
    case DiagnosisErrorCode.INVALID_SESSION_DATA:
    case DiagnosisErrorCode.MISSING_STAGE_DATA:
    case DiagnosisErrorCode.INTEGRITY_CHECK_FAILED:
      return {
        canRetry: false,
        suggestedAction: '最初から診断をやり直してください',
        redirectUrl: '/test'
      }

    case DiagnosisErrorCode.VALIDATION_FAILED:
      return {
        canRetry: true,
        suggestedAction: '回答を確認して再度送信してください',
        redirectUrl: '/test3'
      }

    case DiagnosisErrorCode.DIAGNOSIS_CALCULATION_FAILED:
      return {
        canRetry: true,
        suggestedAction: 'ページを再読み込みしてください'
      }

    case DiagnosisErrorCode.UNKNOWN_ERROR:
    default:
      return {
        canRetry: true,
        suggestedAction: 'しばらく待ってからもう一度お試しください',
        redirectUrl: '/'
      }
  }
}

/**
 * セッションデータの安全な取得（エラーハンドリング付き）
 */
export function safeGetSessionData(stage: number): Record<string, unknown> | null {
  try {
    const rawData = sessionStorage.getItem(`stage${stage}`)
    if (!rawData) {
      throw new DiagnosisError(
        `Stage ${stage} data not found`,
        DiagnosisErrorCode.MISSING_STAGE_DATA,
        { stage }
      )
    }

    const data = JSON.parse(rawData)
    return data
  } catch (error) {
    if (error instanceof DiagnosisError) {
      throw error
    }

    if (error instanceof SyntaxError) {
      throw new DiagnosisError(
        'Invalid session data format',
        DiagnosisErrorCode.INVALID_SESSION_DATA,
        { stage, originalError: error.message }
      )
    }

    throw new DiagnosisError(
      'Failed to retrieve session data',
      DiagnosisErrorCode.UNKNOWN_ERROR,
      { stage, originalError: error instanceof Error ? error.message : String(error) }
    )
  }
}

/**
 * エラーログの記録
 */
export function logError(error: DiagnosisError): void {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      context: error.context
    },
    userAgent: navigator.userAgent,
    url: window.location.href
  }

  // 開発環境ではコンソールに出力
  if (import.meta.env.DEV) {
    console.error('DiagnosisError:', logData)
  }

  // 本番環境では外部ログサービスに送信（将来の拡張）
  if (import.meta.env.PROD) {
    // TODO: 外部ログサービスへの送信実装
    console.warn('Error logged:', error.code)
  }
}

/**
 * エラー表示用のHTML生成
 */
export function createErrorDisplay(error: DiagnosisError): string {
  const message = getErrorMessage(error)
  const recovery = getRecoveryOptions(error)

  return `
    <div class="error-container bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div class="error-icon mb-4">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h2 class="text-xl font-semibold text-red-800 mb-3">
        エラーが発生しました
      </h2>
      
      <p class="text-red-700 mb-6">
        ${message}
      </p>
      
      <div class="error-actions space-x-4">
        ${recovery.redirectUrl ? `
          <a href="${recovery.redirectUrl}" 
             class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            ${recovery.suggestedAction}
          </a>
        ` : ''}
        
        ${recovery.canRetry ? `
          <button onclick="window.location.reload()" 
                  class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            ページを再読み込み
          </button>
        ` : ''}
        
        <a href="/" 
           class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
          ホームに戻る
        </a>
      </div>
      
      ${import.meta.env.DEV ? `
        <details class="mt-6 text-left">
          <summary class="cursor-pointer text-sm text-red-600 hover:text-red-800">
            技術的な詳細（開発用）
          </summary>
          <pre class="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
Error Code: ${error.code}
Context: ${JSON.stringify(error.context, null, 2)}
          </pre>
        </details>
      ` : ''}
    </div>
  `
}

/**
 * エラー処理のメインハンドラー
 */
export function handleDiagnosisError(error: unknown): never {
  let diagnosisError: DiagnosisError

  if (error instanceof DiagnosisError) {
    diagnosisError = error
  } else if (error instanceof Error) {
    diagnosisError = new DiagnosisError(
      error.message,
      DiagnosisErrorCode.UNKNOWN_ERROR,
      { originalError: error.name }
    )
  } else {
    diagnosisError = new DiagnosisError(
      'Unknown error occurred',
      DiagnosisErrorCode.UNKNOWN_ERROR,
      { originalError: String(error) }
    )
  }

  // エラーをログに記録
  logError(diagnosisError)

  // エラー表示を作成
  const errorHtml = createErrorDisplay(diagnosisError)

  // ページの内容をエラー表示に置き換え
  const mainContent = document.getElementById('mainContent') || document.body
  mainContent.innerHTML = errorHtml

  // ローディングスピナーを非表示
  const loadingSpinner = document.getElementById('loadingSpinner')
  if (loadingSpinner) {
    loadingSpinner.classList.add('hidden')
  }

  // メインコンテンツを表示
  if (document.getElementById('mainContent')) {
    document.getElementById('mainContent')!.classList.remove('hidden')
  }

  throw diagnosisError
}

/**
 * セッションデータの安全なクリア
 */
export function safeClearSessionData(): void {
  try {
    sessionStorage.removeItem('stage1')
    sessionStorage.removeItem('stage2')
    sessionStorage.removeItem('stage3')
  } catch (error) {
    console.warn('Failed to clear session data:', error)
  }
}

/**
 * 防御的なページリダイレクト
 */
export function safeRedirect(url: string, fallbackUrl: string = '/'): void {
  try {
    // セッションデータをクリア
    safeClearSessionData()

    // リダイレクト実行
    window.location.href = url
  } catch (error) {
    console.warn('Redirect failed, using fallback:', error)
    window.location.href = fallbackUrl
  }
}
