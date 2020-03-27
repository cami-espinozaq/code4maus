import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

import SpriteSelectorItem from '../../containers/sprite-selector-item.jsx'
import IconWithText from '../icon-text/icon-text.jsx'
import InlineSVG from '../inline-svg/inline-svg.jsx'

import itemStyles from '../sprite-selector-item/sprite-selector-item.css'
import styles from './sprite-selector.css'

import CostumeIcon from '!raw-loader!../../../assets/icons/target_costume.svg'
import AddIcon from '!raw-loader!../../../assets/icons/target_add.svg'

const SpriteSelectorComponent = React.forwardRef((props, ref) => {
  const {
    editingTarget,
    hoveredTarget,
    onDeleteSprite,
    onDuplicateSprite,
    onNewSpriteClick,
    onSelectSprite,
    raised,
    selectedId,
    sprites,
  } = props

  let selectedSprite = sprites[selectedId]
  if (typeof selectedSprite === 'undefined') {
    selectedSprite = {}
  }

  return (
    <>
      <IconWithText className={styles.label} iconSvg={CostumeIcon}>
        Figur
      </IconWithText>
      <div
        aria-label="Sprites auswählen"
        className={styles.itemsWrapper}
        ref={ref}
      >
        {Object.keys(sprites)
          // Re-order by list order
          .sort((id1, id2) => sprites[id1].order - sprites[id2].order)
          .map((id) => sprites[id])
          .map((sprite) => (
            <SpriteSelectorItem
              asset={sprite.costume && sprite.costume.asset}
              className={classNames(styles.sprite, {
                [styles.receivedBlocks]:
                  hoveredTarget.sprite === sprite.id &&
                  sprite.id !== editingTarget &&
                  hoveredTarget.receivedBlocks,
                [styles.raised]: raised && sprite.id !== editingTarget,
                [styles.dragTarget]: sprite.id === hoveredTarget.sprite,
              })}
              id={sprite.id}
              key={sprite.id}
              name={sprite.name}
              selected={sprite.id === selectedId}
              onClick={onSelectSprite}
              onDeleteButtonClick={onDeleteSprite}
              onDuplicateButtonClick={onDuplicateSprite}
              disableDrag
            />
          ))}
        <button
          className={classNames(
            styles.sprite,
            itemStyles.spriteSelectorItem,
            styles.addBox
          )}
          onClick={onNewSpriteClick}
        >
          <InlineSVG svg={AddIcon} />
        </button>
      </div>
    </>
  )
})

SpriteSelectorComponent.displayName = 'SpriteSelectorComponent'

SpriteSelectorComponent.propTypes = {
  editingTarget: PropTypes.string,
  hoveredTarget: PropTypes.shape({
    sprite: PropTypes.string,
    hoveredSprite: PropTypes.string,
    receivedBlocks: PropTypes.bool,
  }),
  onChangeSpriteDirection: PropTypes.func,
  onChangeSpriteName: PropTypes.func,
  onChangeSpriteSize: PropTypes.func,
  onChangeSpriteVisibility: PropTypes.func,
  onChangeSpriteX: PropTypes.func,
  onChangeSpriteY: PropTypes.func,
  onDeleteSprite: PropTypes.func,
  onDuplicateSprite: PropTypes.func,
  onFileUploadClick: PropTypes.func,
  onNewSpriteClick: PropTypes.func,
  onPaintSpriteClick: PropTypes.func,
  onSelectSprite: PropTypes.func,
  onSpriteUpload: PropTypes.func,
  onSurpriseSpriteClick: PropTypes.func,
  raised: PropTypes.bool,
  selectedId: PropTypes.string,
  spriteFileInput: PropTypes.func,
  sprites: PropTypes.shape({
    id: PropTypes.shape({
      costume: PropTypes.shape({
        url: PropTypes.string,
        name: PropTypes.string.isRequired,
        bitmapResolution: PropTypes.number.isRequired,
        rotationCenterX: PropTypes.number.isRequired,
        rotationCenterY: PropTypes.number.isRequired,
      }),
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
    }),
  }),
}

export default SpriteSelectorComponent
