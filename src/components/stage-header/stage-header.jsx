import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import VM from '@wdr-data/scratch-vm';

import Controls from '../../containers/controls.jsx';
import Fullscreen from '../../containers/fullscreen.jsx';
import { getStageSize } from '../../lib/screen-utils.js';
import layout from '../../lib/layout-constants.js';
import Box from '../box/box.jsx';
import ButtonWithIcon from '../button-with-icon/button-with-icon.jsx';

import saveButton from './download@2x.png';
import menuIcon from './menue.svg';
import styles from './stage-header.css';

const StageHeaderComponent = function(props) {
    const {
        isFullScreen,
        onSaveProject,
        vm,
    } = props;

    const height = (window.innerHeight - layout.topBarHeight - layout.stageHeaderHeight - 8) / 2;
    const width = height * 4 / 3;
    const stageSize = getStageSize(isFullScreen, height, width);

    return (
        <Box className={isFullScreen ? styles.stageHeaderWrapperOverlay : styles.stageHeaderWrapper}>
            <Box
                className={styles.stageMenuWrapper}
                style={{ width: stageSize.width }}
            >
                <Controls
                    className={isFullScreen ? styles.controlsFullscreen : ''}
                    vm={vm}
                />
                {isFullScreen
                    ? <Fullscreen />
                    : <React.Fragment>
                        <ButtonWithIcon
                            className={styles.menuButton}
                            iconSrc={menuIcon}
                        >
                                Übersicht
                        </ButtonWithIcon>
                        <ButtonWithIcon
                            className={styles.saveButton}
                            iconSrc={saveButton}
                            onClick={onSaveProject}
                        >
                                Speichern
                        </ButtonWithIcon>
                    </React.Fragment>
                }
            </Box>
        </Box>
    );
};

StageHeaderComponent.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(StageHeaderComponent);
