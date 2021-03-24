import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import TopMenuBar from '../common/TopMenuBar';
import '../../assets/css/home.css';
import CustomSideMenu from '../../containers/SideMenu/Screen';
import Svg from '../common/SvgAnimation';
import ChatContainer from '../../containers/Chat/Screen';

const Screen = ({ logouthandler, currentChat }) => (
  <div className="home-wrapper">
    <TopMenuBar logouthandler={logouthandler} />
    <Grid className="home-container">
      <Grid.Row className="home-row">
        <Grid.Column width={3} className="home-column">
          <CustomSideMenu />
        </Grid.Column>
        <GridColumn width={13} className="home-column">
          {!currentChat ? <Svg /> : <ChatContainer />}
        </GridColumn>
      </Grid.Row>
    </Grid>
  </div>
);

Screen.propTypes = {
  logouthandler: PropTypes.func.isRequired,
  currentChat: PropTypes.string.isRequired,
};

export default Screen;
