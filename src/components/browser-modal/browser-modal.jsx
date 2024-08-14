import PropTypes from 'prop-types'
import React from 'react'
import ReactModal from 'react-modal'
import {
  defineMessages,
  injectIntl,
  FormattedMessage,
} from 'react-intl'

import styles from './browser-modal.css'

const messages = defineMessages({
  label: {
    id: 'gui.unsupportedBrowser.label',
    defaultMessage: 'Browser is not supported',
    description: '',
  },
})

const BrowserModal = ({ intl, ...props }) => (
  <ReactModal
    isOpen
    className={styles.modalContent}
    contentLabel={intl.formatMessage(messages.label)}
    overlayClassName={styles.modalOverlay}
    onRequestClose={props.onBack}
  >
    <div className={styles.illustration} />

    <div className={styles.body}>
      <h2>
        <FormattedMessage {...messages.label} />
      </h2>
      <p>
        {/* eslint-disable max-len */}
        <FormattedMessage
          defaultMessage="We're very sorry, but Scratch 3.0 does not support Internet Explorer, Vivaldi, Opera or Silk. We recommend trying a newer browser such as Google Chrome, Mozilla Firefox, or Microsoft Edge."
          description="Unsupported browser description"
          id="gui.unsupportedBrowser.description"
        />
        {/* eslint-enable max-len */}
      </p>

      <div className={styles.buttonRow}>
        <button className={styles.backButton} onClick={props.onBack}>
          <FormattedMessage
            defaultMessage="Back"
            description="Button to go back in unsupported browser modal"
            id="gui.unsupportedBrowser.back"
          />
        </button>
      </div>
      <div className={styles.faqLinkText}>
        <FormattedMessage
          defaultMessage="To learn more, go to the {previewFaqLink}."
          description="Invitation to try 3.0 preview"
          id="gui.unsupportedBrowser.previewfaq"
          values={{
            previewFaqLink: (
              <a
                className={styles.faqLink}
                href="//scratch.mit.edu/preview-faq"
              >
                <FormattedMessage
                  defaultMessage="Preview FAQ"
                  description="link to Scratch 3.0 preview FAQ page"
                  id="gui.unsupportedBrowser.previewfaqlink"
                />
              </a>
            ),
          }}
        />
      </div>
    </div>
  </ReactModal>
)
BrowserModal.propTypes = {
  intl: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default injectIntl(BrowserModal)
