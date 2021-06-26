import React from 'react';
import { shallow, mount } from 'enzyme';
import { Box } from '@chakra-ui/react';
import GameAdminQuestion from '../components/GameAdminQuestion';

describe('GameAdminQuestion', () => {
  let question;
  beforeEach(() => {
    question = {
      id: '1605679160644.001',
      question: 'New question',
      type: 'single',
      points: 1000,
      duration: 1000,
      answers: [
        'True',
        'False',
      ],
      correctAnswers: [
        0,
      ],
      media: {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    };
  });

  it('should show the question', () => {
    const wrapper = shallow(<GameAdminQuestion question={question} />);
    expect(wrapper.text().includes(question.question)).toEqual(true);
  });

  it('should render a subheaidng for the answers', () => {
    const wrapper = shallow(<GameAdminQuestion question={question} />);
    expect(wrapper.text().includes('Answer Options')).toEqual(true);
  });

  it('should render a Box for each answer', () => {
    const wrapper = shallow(<GameAdminQuestion question={question} />);

    expect(wrapper.find(Box)).toHaveLength(question.answers.length);
  });

  it('should show the answer text', () => {
    const wrapper = shallow(<GameAdminQuestion question={question} />);

    question.answers.forEach((ans) => {
      expect(wrapper.text().includes(ans)).toEqual(true);
    });
  });

  it('should shows the URLMediaPreview', () => {
    const wrapper = mount(<GameAdminQuestion question={question} />);

    expect(wrapper.find('URLMediaPreview')).toHaveLength(1);
  });

  it('should render the URLMediaPreview with the correct props', () => {
    const wrapper = mount(<GameAdminQuestion question={question} />);

    expect(wrapper.find('URLMediaPreview').prop('type')).toEqual(question.media.type);
    expect(wrapper.find('URLMediaPreview').prop('url')).toEqual(question.media.src);
  });

  it('should shows the single answer text', () => {
    const wrapper = shallow(<GameAdminQuestion question={question} />);

    expect(wrapper.text().includes('Choose the best answer')).toEqual(true);
  });

  it('should shows the multiple answer text', () => {
    const wrapper = shallow(<GameAdminQuestion question={{ ...question, type: 'multiple' }} />);

    expect(wrapper.text().includes('Choose all answers that apply')).toEqual(true);
  });

  it('should change the color when the correct answers are shown', () => {
    const wrapper = shallow(<GameAdminQuestion question={question} />);

    const startCol = wrapper.find(Box).at(0).prop('bg');
    wrapper.setProps({ question, showCorrect: true });
    const endCol = wrapper.find(Box).at(0).prop('bg');

    expect(startCol).not.toEqual(endCol);
  });

  it('when the correct answers are shown, correct and incorrect answers should have different colors', () => {
    const wrapper = shallow(<GameAdminQuestion question={question} showCorrect />);

    const correctCol = wrapper.find(Box).at(0).prop('bg');
    const incorrectCol = wrapper.find(Box).at(1).prop('bg');

    expect(correctCol).not.toEqual(incorrectCol);
  });
});
