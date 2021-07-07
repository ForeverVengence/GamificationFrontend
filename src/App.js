import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  ChakraProvider,
  ColorModeScript,
  Flex,
} from '@chakra-ui/react';
import DashboardPage from './pages/DashboardPage';
import DashboardStudent from './pages/DashboardStudent';
import GameEditPage from './pages/GameEditPage';
import GameEditQuestionPage from './pages/GameEditQuestionPage';
import GameResultsPage from './pages/GameResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import JoinGame from './pages/JoinGame';
import PlayGame from './pages/PlayGame';
import PlayLevel from './pages/PlayLevel';
import Header from './components/Header';
import Footer from './components/Footer';
import { QuizContextProvider } from './context/QuizContext';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContextProvider } from './context/AuthContext';
import { SessionContextProvider } from './context/SessionContext';
import HomePage from './pages/HomePage';
import Courses from './pages/Courses';
import TopicGroups from './pages/TopicGroups';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />
      <Router>
        <AuthContextProvider>
          <Flex h="100%" direction="column">
            <Header />
            <Switch>
              <Route exact path="/" component={HomePage} />

              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />

              <Route exact path="/game/join/:session?">
                <SessionContextProvider>
                  <JoinGame />
                </SessionContextProvider>
              </Route>
              <Route exact path="/game/play/:session" component={PlayGame}>
                <SessionContextProvider>
                  <PlayGame />
                </SessionContextProvider>
              </Route>

              <Route exact path="/admin">
                <QuizContextProvider>
                  <DashboardPage />
                </QuizContextProvider>
              </Route>
              <Route exact path="/topicgroups">
                <QuizContextProvider>
                  <TopicGroups />
                </QuizContextProvider>
              </Route>
              <Route exact path="/courses">
                <QuizContextProvider>
                  <Courses />
                </QuizContextProvider>
              </Route>
              <Route exact path="/student">
                <QuizContextProvider>
                  <DashboardStudent />
                </QuizContextProvider>
              </Route>
              <Route exact path="/admin/edit/:gameId([0-9]+)?">
                <QuizContextProvider>
                  <GameEditPage />
                </QuizContextProvider>
              </Route>
              <Route exact path="/level/play/:level([0-9]+)?">
                <QuizContextProvider>
                  <PlayLevel />
                </QuizContextProvider>
              </Route>
              <Route exact path="/admin/edit/:gameId([0-9]+)/question/:questionId([0-9]+.[0-9]+)">
                <QuizContextProvider>
                  <GameEditQuestionPage />
                </QuizContextProvider>
              </Route>
              <Route exact path="/admin/results/:sessionId([0-9]+)">
                <QuizContextProvider>
                  <GameResultsPage />
                </QuizContextProvider>
              </Route>

              <Route path="*" component={NotFoundPage} />
            </Switch>
            <Footer />
          </Flex>
        </AuthContextProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
