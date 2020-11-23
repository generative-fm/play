import React from 'react';
import { Switch, Route } from 'react-router-dom';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import TopNav from '../top-nav/top-nav';
import BottomNav from '../bottom-nav/bottom-nav';
import ControlBar from '../controls/control-bar';
import Piece from '../piece/piece';
import Browse from '../browse/browse';
import Flavor from '../flavor/flavor';
import useIsNarrowScreen from './use-is-narrow-screen';
import selectCurrentPieceId from '../playback/queue/select-current-piece-id';
import styles from './layout.module.scss';

const Layout = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const currentPieceId = useSelector(selectCurrentPieceId);

  return (
    <div
      className={classnames(styles.layout, {
        [styles['layout--is-narrow']]: isNarrowScreen,
        [styles['layout--has-controls']]: currentPieceId !== null,
      })}
    >
      {!isNarrowScreen && <TopNav />}
      <div className={styles['layout__content']}>
        <Switch>
          <Route path="/" exact component={Browse} />
          <Route path="/piece/:id" component={Piece} />
          <Route path="/flavor/:flavor" component={Flavor} />
        </Switch>
      </div>
      {currentPieceId && <ControlBar />}
      {isNarrowScreen && <BottomNav />}
    </div>
  );
};
export default Layout;