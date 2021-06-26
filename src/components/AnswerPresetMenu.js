import {
  IconButton, Menu, MenuButton, MenuGroup, MenuItem, MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const presets = {
  trueFalse: {
    name: 'True / False',
    answers: ['True', 'False'],
  },
  abcd: {
    name: 'a / b / c / d',
    answers: ['a', 'b', 'c', 'd'],
  },
  abcdef: {
    name: 'a / b / c / d / e / f',
    answers: ['a', 'b', 'c', 'd', 'e', 'f'],
  },
  abcdAllNone: {
    name: 'a / b / c / d / all / none',
    answers: ['a', 'b', 'c', 'd', 'All of the above', 'None of the above'],
  },
  lmao: {
    name: 'Cool Answers',
    answers: [
      'https://www.youtube.com/watch?v=6n3pFFPSlW4',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=fC7oUOUEEi4',
    ],
  },
};

function AnswerPresetMenu({ onSelect }) {
  const handleItemClick = (key) => () => {
    onSelect(presets[key].answers);
  };

  return (
    <Menu zIndex="dropdown">
      <MenuButton
        colorScheme="green"
        variant="solid"
        as={IconButton}
        icon={<FiChevronDown />}
        aria-label="use an answer preset"
      />

      <MenuList zIndex="dropdown">
        <MenuGroup zIndex="dropdown" title="Presets">
          {Object.entries(presets)
            .map(([key, { name }]) => (
              <MenuItem onClick={handleItemClick(key)} key={key} id={key}>{name}</MenuItem>
            ))}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}

AnswerPresetMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default AnswerPresetMenu;
