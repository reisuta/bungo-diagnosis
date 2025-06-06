export interface Stage3Answers {
  ques1?: string;
  ques2?: string;
  ques3?: string;
  ques4?: string;
  ques5?: string;
}

interface AuthorCandidate {
  author: string;
  points: number;
}

export function diagnose(
  stage1Score: number,
  stage2Score: number,
  stage3Score: number,
  isGeneral: boolean,
  stage3Answers?: Stage3Answers
): string {
  return calculateResult(stage1Score, stage2Score, stage3Score, isGeneral, stage3Answers)
}

export function calculateResult(
  stage1Score: number,
  stage2Score: number,
  stage3Score: number,
  isGeneral: boolean,
  stage3Answers?: Stage3Answers
): string {
  if (isGeneral) {
    return stage2Score >= 30
      ? determineLeaderType(stage3Score, stage3Answers)
      : determineMypaceType(stage3Score, stage3Answers)
  } else {
    return stage2Score >= 15
      ? determineRareType(stage3Score, stage3Answers)
      : determineSensitiveType(stage3Score, stage3Answers)
  }
}

function determineLeaderType(score: number, answers?: Stage3Answers): string {
  if (!answers) return getScoreBasedResult(score, ['kikuti', 'kouyou', 'natume', 'siga'])

  const candidates: AuthorCandidate[] = [
    {
      author: 'kikuti',
      points: calculateKikutiPoints(answers, score)
    },
    {
      author: 'kouyou',
      points: calculateKouyouPoints(answers, score)
    },
    {
      author: 'natume',
      points: calculateNatumePoints(answers, score)
    },
    {
      author: 'siga',
      points: calculateSigaPoints(answers, score)
    }
  ]

  const winner = getHighestPointsCandidate(candidates)
  return winner.points >= 2 ? winner.author : getScoreBasedResult(score, ['kikuti', 'kouyou', 'natume', 'siga'])
}

function determineMypaceType(score: number, answers?: Stage3Answers): string {
  if (!answers) return getScoreBasedResult(score, ['saneatu', 'ougai', 'kahuu', 'ranpo'])

  const candidates: AuthorCandidate[] = [
    {
      author: 'saneatu',
      points: calculateSaneatuPoints(answers, score)
    },
    {
      author: 'kahuu',
      points: calculateKahuuPoints(answers, score)
    },
    {
      author: 'ougai',
      points: calculateOugaiPoints(answers, score)
    },
    {
      author: 'ranpo',
      points: calculateRanpoPoints(answers, score)
    }
  ]

  const winner = getHighestPointsCandidate(candidates)
  return winner.points >= 2 ? winner.author : getScoreBasedResult(score, ['saneatu', 'ougai', 'kahuu', 'ranpo'])
}

function determineRareType(score: number, answers?: Stage3Answers): string {
  if (!answers) return getScoreBasedResult(score, ['simada', 'zenzou', 'bizan', 'kazii'])

  const simadaPoints = calculateSimadaPoints(answers, score)
  if (simadaPoints >= 3 || (simadaPoints >= 2 && score >= 35)) {
    return 'simada'
  }

  const candidates: AuthorCandidate[] = [
    {
      author: 'bizan',
      points: calculateBizanPoints(answers, score)
    },
    {
      author: 'zenzou',
      points: calculateZenzouPoints(answers, score)
    },
    {
      author: 'kazii',
      points: calculateKaziiPoints(answers, score)
    }
  ]

  const winner = getHighestPointsCandidate(candidates)
  return winner.points >= 3 ? winner.author : getScoreBasedResult(score, ['simada', 'zenzou', 'bizan', 'kazii'])
}

function determineSensitiveType(score: number, answers?: Stage3Answers): string {
  if (!answers) return getScoreBasedResult(score, ['akutagawa', 'itiyou', 'tanizaki', 'dazai'])

  const candidates: AuthorCandidate[] = [
    {
      author: 'dazai',
      points: calculateDazaiPoints(answers, score)
    },
    {
      author: 'akutagawa',
      points: calculateAkutagawaPoints(answers, score)
    },
    {
      author: 'itiyou',
      points: calculateItiyouPoints(answers, score)
    },
    {
      author: 'tanizaki',
      points: calculateTanizakiPoints(answers, score)
    }
  ]

  const winner = getHighestPointsCandidate(candidates)
  return winner.points >= 2 ? winner.author : getScoreBasedResult(score, ['akutagawa', 'itiyou', 'tanizaki', 'dazai'])
}

function calculateKikutiPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques2 === '10') points += 2
  if (answers.ques4 === '10') points += 2
  if (score >= 30) points += 1
  return points
}

function calculateKouyouPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques1 === '10') points += 2
  if (answers.ques3 === '10') points += 1
  if (answers.ques4 === '3') points += 1
  if (score >= 25) points += 1
  return points
}

function calculateNatumePoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques2 === '3') points += 2
  if (score >= 35) points += 1
  return points
}

function calculateSigaPoints(answers: Stage3Answers, _score: number): number {
  let points = 0
  if (answers.ques3 === '5') points += 2
  if (answers.ques4 === '5') points += 1
  return points
}

function calculateSaneatuPoints(answers: Stage3Answers, _score: number): number {
  let points = 0
  if (answers.ques1 === '10') points += 2
  if (answers.ques5 === '10') points += 2
  if (answers.ques4 === '3') points += 1
  return points
}

function calculateKahuuPoints(answers: Stage3Answers, _score: number): number {
  let points = 0
  if (answers.ques3 === '10') points += 2
  if (answers.ques4 === '7') points += 2
  return points
}

function calculateOugaiPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques4 === '10') points += 2
  if (answers.ques5 === '5') points += 1
  if (score >= 25) points += 1
  return points
}

function calculateRanpoPoints(answers: Stage3Answers, _score: number): number {
  let points = 0
  if (answers.ques2 === '10') points += 2
  if (answers.ques4 === '5') points += 1
  return points
}

function calculateSimadaPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques5 === '10') points += 3
  if (answers.ques3 === '10') points += 3
  if (answers.ques2 === '10') points += 1
  if (answers.ques1 === '10') points += 1
  if (score >= 40) points += 1
  return points
}

function calculateBizanPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques3 === '5') points += 3
  if (answers.ques4 === '7') points += 2
  if (answers.ques1 === '10') points += 1
  if (score >= 35) points += 1
  return points
}

function calculateZenzouPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques2 === '10') points += 2
  if (answers.ques4 === '3') points += 2
  if (answers.ques3 === '5') points += 1
  if (score >= 25) points += 1
  return points
}

function calculateKaziiPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques4 === '5') points += 2
  if (answers.ques1 === '10') points += 1
  if (score >= 20) points += 1
  return points
}

function calculateDazaiPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques3 === '10') points += 2
  if (answers.ques4 === '10') points += 2
  if (score <= 20) points += 1
  return points
}

function calculateAkutagawaPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques5 === '10') points += 2
  if (answers.ques4 === '7') points += 1
  if (score >= 30) points += 1
  return points
}

function calculateItiyouPoints(answers: Stage3Answers, score: number): number {
  let points = 0
  if (answers.ques2 === '10') points += 2
  if (answers.ques4 === '3') points += 1
  if (score >= 25) points += 1
  return points
}

function calculateTanizakiPoints(answers: Stage3Answers, _score: number): number {
  let points = 0
  if (answers.ques1 === '10') points += 2
  if (answers.ques4 === '5') points += 1
  return points
}

function getHighestPointsCandidate(candidates: AuthorCandidate[]): AuthorCandidate {
  return candidates.reduce((prev, current) =>
    current.points > prev.points ? current : prev
  )
}

function getScoreBasedResult(score: number, authors: string[]): string {
  const thresholds = [35, 25, 15, 0]
  for (let i = 0; i < thresholds.length; i++) {
    if (score >= thresholds[i]) {
      return authors[i] || authors[authors.length - 1]
    }
  }
  return authors[authors.length - 1]
}
