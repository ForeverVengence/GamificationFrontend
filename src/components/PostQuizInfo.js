import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { HorizontalBar, Line } from '@reactchartjs/react-chart.js';
import { saveAs } from 'file-saver';

import { FiShare } from 'react-icons/fi';
import QuizStatusType from '../types/QuizStatusType';
import QuizResultPodium from './QuizResultPodium';
import getInterestingData from '../utils/getInterestingData';

const SAVE_TYPES = {
  all: 'All Results',
  correctness: 'Question Correctness',
  responseTimes: 'Question Response Times',
  performace: 'Player Performance',
};

function PostQuizInfo({ results, status }) {
  const { colors } = useTheme();
  const vizColors = useColorModeValue(
    {
      green: colors.green[500],
      red: colors.red[500],
      teal: colors.teal[500],
      purple: colors.purple[500],
      textCol: colors.gray[800],
    },
    {
      green: colors.green[300],
      red: colors.red[300],
      teal: colors.teal[300],
      purple: colors.purple[300],
      textCol: colors.whiteAlpha[900],
    },
  );
  const {
    topPlayers,
    correctnessData,
    correctnessDataRaw,
    responseTimeData,
    responseTimeDataRaw,
    performanceData,
    performanceDataRaw,
    nPlayers,
  } = useMemo(() => getInterestingData(results, status.questions, vizColors), [
    results,
    status.questions,
    vizColors,
  ]);

  const vizOptions = useMemo(() => ({
    legend: {
      labels: {
        fontColor: vizColors.textCol,
      },
    },
    scales: {
      scaleLabel: {
        fontColor: vizColors.textCol,
      },
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: vizColors.textCol,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: vizColors.textCol,
          },
        },
      ],
    },
  }), [vizColors]);

  if (results.length === 0) {
    return (
      <>
        <Heading as="h1" mt={8} mb={6}>
          Quiz Results
        </Heading>
        <Heading as="h2" size="lg" mb={4}>
          This session had no players ☹.
        </Heading>
      </>
    );
  }

  const performanceChartHeight = nPlayers * 50 + 100;

  const handleExport = (type) => () => {
    let toExport = null;
    switch (type) {
      case SAVE_TYPES.all:
        toExport = { results, questions: status.questions };
        break;
      case SAVE_TYPES.correctness:
        toExport = correctnessDataRaw;
        break;
      case SAVE_TYPES.responseTimes:
        toExport = responseTimeDataRaw;
        break;
      case SAVE_TYPES.performace:
        toExport = performanceDataRaw;
        break;
      default:
        return;
    }

    const text = JSON.stringify(toExport, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    saveAs(blob, 'export.json');
  };

  return (
    <>
      <Heading as="h1" mt={8} mb={6}>
        Quiz Results
      </Heading>
      <Box mb={6}>
        <Box mb={4}>
          <Heading as="h2" size="lg" mb={4}>
            Top Players
          </Heading>
          {topPlayers.length ? (
            <QuizResultPodium topPlayers={topPlayers} />
          ) : (
            <Text>No one got any questions right. You all suck!</Text>
          )}
        </Box>

        <Box mb={4}>
          <Flex mb={4}>
            <Heading flex="1" as="h2" size="lg">
              Data
            </Heading>
            <Menu placement="bottom-end">
              <MenuButton colorScheme="green" leftIcon={<FiShare />} as={Button}>Export</MenuButton>
              <MenuList>
                {Object.values(SAVE_TYPES).map((type) => (
                  <MenuItem key={type} onClick={handleExport(type)}>
                    Export
                    {' '}
                    {type}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
          <Accordion defaultIndex={[0]} allowMultiple allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Question Correctness
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <HorizontalBar
                  data={correctnessData}
                  options={vizOptions}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Question Response Times
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Line
                  data={responseTimeData}
                  options={vizOptions}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Player Performance
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <HorizontalBar
                  height={performanceChartHeight}
                  data={performanceData}
                  options={{
                    ...vizOptions,
                    maintainAspectRatio: false,
                    scales: {
                      ...vizOptions.scales,
                      xAxes: performanceData.xAxes,
                    },
                  }}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </>
  );
}

PostQuizInfo.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          answerIds: PropTypes.arrayOf(PropTypes.number),
          correct: PropTypes.bool.isRequired,
          questionStartedAt: PropTypes.string,
          answeredAt: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  status: QuizStatusType.isRequired,
};

export default PostQuizInfo;
