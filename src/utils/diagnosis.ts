// 診断ロジックの実装
export function diagnose(
  stage1Score: number,
  stage2Score: number,
  stage3Score: number,
  isGeneral: boolean
): string {
  return calculateResult(stage1Score, stage2Score, stage3Score, isGeneral)
}

export function calculateResult(
  stage1Score: number,
  stage2Score: number,
  stage3Score: number,
  isGeneral: boolean
): string {
  // 元のDjangoアプリの複雑な分岐ロジックを再現

  if (isGeneral) {
    // 一般人ルート
    if (stage2Score >= 25) {
      // リーダータイプの分岐
      const totalScore = stage3Score

      if (totalScore >= 28) {
        return 'kikuti' // 菊池寛
      } else if (totalScore >= 18) {
        return 'kouyou' // 尾崎紅葉
      } else {
        return 'siga' // 志賀直哉
      }
    } else {
      // 性欲タイプの分岐
      const totalScore = stage3Score

      if (totalScore >= 25) {
        return 'itiyou' // 樋口一葉
      } else if (totalScore >= 15) {
        return 'kahuu' // 永井荷風
      } else if (totalScore >= 10) {
        return 'bizan' // 川上眉山
      } else {
        return 'simada' // 島田清次郎
      }
    }
  } else {
    // 文豪ルート
    if (stage2Score >= 15) {
      // 繊細タイプの分岐
      const totalScore = stage3Score

      if (totalScore >= 25) {
        return 'akutagawa' // 芥川龍之介
      } else if (totalScore >= 15) {
        return 'kazii' // 梶井基次郎
      } else {
        return 'ranpo' // 江戸川乱歩
      }
    } else {
      // リーダータイプの分岐
      const totalScore = stage3Score

      if (totalScore >= 30) {
        return 'natume' // 夏目漱石
      } else if (totalScore >= 25) {
        return 'ougai' // 森鷗外
      } else if (totalScore >= 20) {
        return 'tanizaki' // 谷崎潤一郎
      } else if (totalScore >= 15) {
        return 'saneatu' // 武者小路実篤
      } else if (totalScore >= 10) {
        return 'zenzou' // 葛西善蔵
      } else {
        return 'dazai' // 太宰治
      }
    }
  }
}
