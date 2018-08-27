import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { addLocaleData, IntlProvider } from 'react-intl';
import de from 'react-intl/locale-data/de';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import { Views, ContentPages } from '../lib/routing';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import localeDe from '../../translations/de.json';
import storage, { s3userFile } from '../lib/storage';
import { setUserId } from '../reducers/project';

import ParentHelp from '../lib/content/parents.md';

import GUI from './gui.jsx';
import Menu from './menu.jsx';
import ContentWrapper from '../components/content-wrapper/content-wrapper.jsx';
import Loader from '../components/loader/loader.jsx';

addLocaleData(de);

class App extends Component {
    static async userIdExists(userId) {
        try {
            const res = await fetch(s3userFile(userId, 'index.json'), {
                method: 'HEAD',
            });
            if (res.status >= 400) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    componentDidMount() {
        this.createUserId();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) {
            storage.userId = this.props.userId;
        }
    }

    async createUserId() {
        const localStorage = window.localStorage;
        let userId = localStorage.getItem('deviceId');
        if (!userId) {
            while (!userId || await App.userIdExists(userId)) {
                userId = uuid();
            }
            localStorage.setItem('deviceId', userId);
        }

        storage.userId = userId;
        this.props.setUserId(userId);
    }

    renderContent() {
        switch (this.props.page) {
        case ContentPages.parents:
        default:
            return <ParentHelp />;
        }
    }

    renderView() {
        switch (this.props.view) {
        case Views.edu:
        case Views.onboarding:
        case Views.project:
            return <GUI />;
        case Views.content:
            return <ContentWrapper>{this.renderContent()}</ContentWrapper>;
        case Views.menu:
        default:
            return <Menu />;
        }
    }

    render() {
        if (this.props.userId === null) {
            return <Loader />;
        }

        return (
            <IntlProvider
                locale="de"
                messages={localeDe}
            >
                {this.renderView()}
            </IntlProvider>
        );
    }
}

App.propTypes = {
    view: PropTypes.string.isRequired,
    page: PropTypes.string,
    setUserId: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
};

const ConnectedApp = connect(
    (state) => {
        const result = state.router.result || {};
        return {
            view: result.view || '',
            page: result.page || '',
            userId: state.scratchGui.project.userId,
        };
    },
    {
        setUserId,
    }
)(App);

const WrappedApp = ErrorBoundaryHOC('Top Level App')(
    AppStateHOC(ConnectedApp),
);

WrappedApp.setAppElement = ReactModal.setAppElement;
export default WrappedApp;
