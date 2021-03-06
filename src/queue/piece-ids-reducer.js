import { USER_PLAYED_PIECE } from '../playback/user-played-piece';
import { USER_ENABLED_SHUFFLE } from './user-enabled-shuffle';
import { USER_DISABLED_SHUFFLE } from './user-disabled-shuffle';
import { USER_QUEUED_PIECE } from './user-queued-piece';
import { USER_UNQUEUED_PIECE } from './user-unqueued-piece';

const copyIfChanged = ({ state, pieceIds }) => {
  if (
    state.length !== pieceIds.length ||
    state.some((pieceId, i) => pieceId !== pieceIds[i])
  ) {
    return pieceIds.slice();
  }
  return state;
};

const pieceIdsReducer = (state = [], action) => {
  switch (action.type) {
    case USER_PLAYED_PIECE: {
      return copyIfChanged({
        state,
        pieceIds: action.payload.selectionPieceIds,
      });
    }
    case USER_ENABLED_SHUFFLE: {
      return copyIfChanged({
        state,
        pieceIds: action.payload.shuffledPieceIds,
      });
    }
    case USER_DISABLED_SHUFFLE: {
      return copyIfChanged({
        state,
        pieceIds: action.payload.unshuffledPieceIds,
      });
    }
    case USER_QUEUED_PIECE: {
      const { pieceId, index = state.length } = action.payload;
      return state.slice(0, index).concat([pieceId]).concat(state.slice(index));
    }
    case USER_UNQUEUED_PIECE: {
      const { pieceId } = action.payload;
      return state.filter((otherPieceId) => otherPieceId !== pieceId);
    }
  }
  return state;
};

export default pieceIdsReducer;
