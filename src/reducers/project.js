const SET_PROJECT_NAME = 'scratch-gui/project/SET_PROJECT_NAME'
const SET_PROJECT_ID = 'scratch-gui/project/SET_PROJECT_ID'
const SET_USER_ID = 'scratch-gui/project/SET_USER_ID'
const SET_CUSTOM_BLOCKS = 'scratch-gui/project/SET_CUSTOM_BLOCKS'
// const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

const initialState = {
  customBlocks: null,
  name: '',
  id: '',
  userId: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PROJECT_NAME:
      return {
        ...state,
        name: action.name,
      }
    case SET_PROJECT_ID:
      return {
        ...state,
        id: action.id,
      }
    case SET_USER_ID:
      return {
        ...state,
        userId: action.userId,
      }
    case SET_CUSTOM_BLOCKS:
      return {
        ...state,
        customBlocks: action.blocks,
      }
    default:
      return state
  }
}

export function setProjectName(name) {
  return {
    type: SET_PROJECT_NAME,
    name,
  }
}

export function setProjectId(id) {
  return {
    type: SET_PROJECT_ID,
    id,
  }
}

export function setUserId(userId) {
  return {
    type: SET_USER_ID,
    userId,
  }
}

export function setCustomBlocks(blocks) {
  return {
    type: SET_CUSTOM_BLOCKS,
    blocks,
  }
}

export const projectInitialState = initialState
