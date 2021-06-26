import avg from './avg';

function hexSetAlpha(hex, percent) {
  return hex.substring(0, 7) + Math.floor(255 * percent).toString(16);
}

function getResponseTime(result) {
  return Math.round(
    new Date(result.answeredAt) - new Date(result.questionStartedAt),
  ) / 1000;
}

function getInterestingData(results, questions, colors) {
  const playersVsPoints = [];
  const questionsVsCorrect = questions.map(({ question }) => ({
    question,
    nCorrect: 0,
    nAnswered: 0,
  }));
  const questionsVsResponseTimes = new Array(questions.length)
    .fill()
    .map(() => []);
  const nPlayers = results.length;
  const nQuestions = questions.length;

  results.forEach((player) => {
    let points = 0;
    let nCorrect = 0;
    let nAnswered = 0;

    player.answers.forEach((ans, i) => {
      if (ans.answerIds.length) {
        questionsVsCorrect[i].nAnswered += 1;
        nAnswered += 1;
        if (ans.correct) {
          questionsVsCorrect[i].nCorrect += 1;
          points += questions[i].points;
          nCorrect += 1;
        }
        questionsVsResponseTimes[i].push(getResponseTime(ans));
      }
    });

    playersVsPoints.push({
      player: player.name,
      points,
      nCorrect,
      nAnswered,
    });
  });

  const topPlayers = [...playersVsPoints]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .filter((p) => p.nCorrect);

  // Question Data
  const questionNumLabels = questions.map((_, i) => `Q${i + 1}`);

  const correctnessData = {
    labels: questionNumLabels,
    datasets: [
      {
        label: '# Correct',
        data: questionsVsCorrect.map(({ nCorrect }) => nCorrect),
        backgroundColor: hexSetAlpha(colors.green, 0.5),
        borderColor: colors.green,
        borderWidth: 2,
      },
      {
        label: '# Wrong',
        data: questionsVsCorrect.map(({ nCorrect }) => nPlayers - nCorrect),
        backgroundColor: hexSetAlpha(colors.red, 0.5),
        borderColor: colors.red,
        borderWidth: 2,
      },
      {
        label: '# Answered',
        data: questionsVsCorrect.map(({ nAnswered }) => nAnswered),
        backgroundColor: hexSetAlpha(colors.teal, 0.5),
        borderColor: colors.teal,
        borderWidth: 2,
      },
    ],
  };

  const responseTimeData = {
    labels: questionNumLabels,
    datasets: [
      {
        label: 'Average',
        data: questionsVsResponseTimes.map((times) => avg(...times)),
        backgroundColor: hexSetAlpha(colors.teal, 0.5),
        borderColor: colors.teal,
        tension: 0,
        fill: false,
      },
      {
        label: 'Shortest',
        data: questionsVsResponseTimes.map((times) => Math.min(...times)),
        backgroundColor: hexSetAlpha(colors.green, 0.5),
        borderColor: colors.green,
        tension: 0,
        fill: false,
      },
      {
        label: 'Longest',
        data: questionsVsResponseTimes.map((times) => Math.max(...times)),
        backgroundColor: hexSetAlpha(colors.red, 0.5),
        borderColor: colors.red,
        tension: 0,
        fill: false,
      },
    ],
  };

  // Player Data

  const playersByName = playersVsPoints.sort((a, b) => a.player.localeCompare(b.player, 'en', { numeric: true }));

  const performanceData = {
    labels: playersByName.map(({ player }) => player.substring(0, 10)),
    datasets: [
      {
        label: 'Points',
        data: playersByName.map(({ points }) => points),
        backgroundColor: hexSetAlpha(colors.purple, 0.5),
        borderColor: colors.purple,
        borderWidth: 2,
        xAxisID: 'x-axis-points',
      },
      {
        label: '# Correct',
        data: playersByName.map(({ nCorrect }) => nCorrect),
        backgroundColor: hexSetAlpha(colors.green, 0.5),
        borderColor: colors.green,
        borderWidth: 2,
        xAxisID: 'x-axis-questions',
      },
      {
        label: '# Wrong',
        data: playersByName.map(({ nCorrect }) => nQuestions - nCorrect),
        backgroundColor: hexSetAlpha(colors.red, 0.5),
        borderColor: colors.red,
        borderWidth: 2,
        xAxisID: 'x-axis-questions',
      },
      {
        label: '# Answered',
        data: playersByName.map(({ nAnswered }) => nAnswered),
        backgroundColor: hexSetAlpha(colors.teal, 0.5),
        borderColor: colors.teal,
        borderWidth: 2,
        xAxisID: 'x-axis-questions',
      },
    ],
    xAxes: [
      {
        type: 'linear',
        position: 'top',
        display: true,
        ticks: {
          beginAtZero: true,
          fontColor: colors.textCol,
        },
        id: 'x-axis-points',
      },
      {
        type: 'linear',
        display: true,
        ticks: {
          beginAtZero: true,
          fontColor: colors.textCol,
        },
        id: 'x-axis-questions',
      },
    ],
  };

  return {
    topPlayers,
    correctnessData,
    correctnessDataRaw: questionsVsCorrect,
    responseTimeData,
    responseTimeDataRaw: questionsVsResponseTimes,
    performanceData,
    performanceDataRaw: playersVsPoints,
    nPlayers,
    nQuestions,
  };
}

export default getInterestingData;
