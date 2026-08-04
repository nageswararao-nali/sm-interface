import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const ActionsDD = (props) => {
  const { actionItems } = props
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        Button Dropdown
      </DropdownToggle>
      <DropdownMenu>
        {
          actionItems.map((actionItem) => {
            <DropdownItem>Another Action</DropdownItem>
          })
        }
      </DropdownMenu>
    </ButtonDropdown>
  );
}

export default ActionsDD;