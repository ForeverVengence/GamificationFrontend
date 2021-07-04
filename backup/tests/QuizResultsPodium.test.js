import React from 'react';
import { shallow } from 'enzyme';
import QuizResultsPodium from '../components/QuizResultPodium';

describe('QuizResultsPodium', () => {
  let players;
  beforeEach(() => {
    players = [
      {
        player: 'Player a',
        points: 5000,
        nCorrect: 5,
      },
      {
        player: 'Player b',
        points: 4000,
        nCorrect: 4,
      },
      {
        player: 'Player c',
        points: 3000,
        nCorrect: 3,
      },
      {
        player: 'Player d',
        points: 2000,
        nCorrect: 2,
      },
      {
        player: 'Player e',
        points: 1000,
        nCorrect: 1,
      },
    ];
  });

  it('renders the players\' names', () => {
    const wrapper = shallow(<QuizResultsPodium topPlayers={players} />);

    players.forEach((p) => {
      expect(wrapper.html().includes(p.player)).toEqual(true);
    });
  });

  it('renders the players\' points followed by \'Points\'', () => {
    const wrapper = shallow(<QuizResultsPodium topPlayers={players} />);

    players.forEach((p) => {
      expect(wrapper.html().includes(`${p.points} Points`)).toEqual(true);
    });
  });

  it('renders the players\' nCorrect followed by \'Correct\'', () => {
    const wrapper = shallow(<QuizResultsPodium topPlayers={players} />);

    players.forEach((p) => {
      expect(wrapper.html().includes(`${p.nCorrect} Correct`)).toEqual(true);
    });
  });

  it('renders a maximum of 5 players', () => {
    const sixthPlayer = { player: 'PLAYER 6', points: 2000, nCorrect: 2 };
    const wrapper = shallow(<QuizResultsPodium topPlayers={[...players, sixthPlayer]} />);

    expect(wrapper.html().includes(sixthPlayer.player)).toEqual(false);
  });
});
