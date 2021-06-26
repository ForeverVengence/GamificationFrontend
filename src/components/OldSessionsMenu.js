import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Menu, MenuButton, MenuItem, MenuList, Portal,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function OldSessionsMenu({ oldSessions }) {
  return (
    <>
      <Menu placement="bottom">
        <MenuButton mb={4} w="100%" variant="outline" colorScheme="teal" as={Button}>Past Sessions</MenuButton>
        <Portal>
          <MenuList maxH="20rem" overflowY="auto">
            {oldSessions.length ? oldSessions.map((s) => (
              <MenuItem key={s} as={RouterLink} textAlign="center" to={`/admin/results/${s}`}>
                {s}
              </MenuItem>
            )) : <MenuItem isFocusable={false}>This quiz has no old sessions!</MenuItem>}
          </MenuList>
        </Portal>
      </Menu>
    </>
  );
}

OldSessionsMenu.propTypes = {
  oldSessions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default OldSessionsMenu;
