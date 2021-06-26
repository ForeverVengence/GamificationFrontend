import React from 'react';
import { shallow, mount } from 'enzyme';
import { MenuButton, MenuItem } from '@chakra-ui/react';
import AnswerPresetMenu, { presets } from '../components/AnswerPresetMenu';

const noop = () => {};

describe('AnswerPresetMenu', () => {
  it('should render a MenuButton', () => {
    const wrapper = shallow(<AnswerPresetMenu onSelect={noop} />);

    expect(wrapper.find('MenuButton')).toHaveLength(1);
  });

  it('should render a MenuButton with the correct aria-label', () => {
    const wrapper = shallow(<AnswerPresetMenu onSelect={noop} />);

    const menuBtn = wrapper.find('MenuButton');

    expect(menuBtn.prop('aria-label')).toEqual('use an answer preset');
  });

  it('should render a MenuItem for each preset', () => {
    const wrapper = shallow(<AnswerPresetMenu onSelect={noop} />);

    expect(wrapper.find('MenuItem')).toHaveLength(Object.keys(presets).length);
  });

  it('should render the name\'s of the presets', () => {
    const wrapper = shallow(<AnswerPresetMenu onSelect={noop} />);

    Object.values(wrapper).forEach(({ name }) => {
      expect(wrapper.text().includes(name)).toEqual(true);
    });
  });

  it('should render the group title', () => {
    const wrapper = mount(<AnswerPresetMenu onSelect={noop} />);

    expect(wrapper.text().includes('Presets')).toEqual(true);
  });

  it('should call onSelect with the answers when an item is clicked', () => {
    const onSelect = jest.fn();
    const wrapper = shallow(<AnswerPresetMenu onSelect={onSelect} />);

    wrapper.find(MenuButton).simulate('click');
    wrapper.find(MenuItem).at(0).simulate('click');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('should call onSelect with the answers when an item is clicked', () => {
    const onSelect = jest.fn();
    const wrapper = shallow(<AnswerPresetMenu onSelect={onSelect} />);

    Object.values(presets).forEach(({ answers }, i) => {
      wrapper.find(MenuButton).simulate('click');
      wrapper.find(MenuItem).at(i).simulate('click');
      expect(onSelect).toHaveBeenCalledWith(answers);
    });
  });
});
