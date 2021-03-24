import React from 'react';
import { Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ResultRenderer from './ResultRenderer';

const SearchBar = ({ userList, onSearchChange, selectUserFromList }) => (
  <div className="search-bar-container">
    <Search
      size="large"
      loading={userList.loading}
      onResultSelect={selectUserFromList}
      onSearchChange={onSearchChange}
      results={userList.results}
      value={userList.value}
      resultRenderer={ResultRenderer}
      className="search-bar"
    />
  </div>
);

SearchBar.propTypes = {
  userList: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectUserFromList: PropTypes.func.isRequired,
};

export default SearchBar;
