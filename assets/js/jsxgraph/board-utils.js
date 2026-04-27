import { BOARD_OPTIONS } from './common-styles.js';

let boardCounter = 0;

/**
 * Crée un conteneur JXG et initialise un board.
 * @param {HTMLElement} mountNode
 * @param {{ boundingbox?: [number, number, number, number], axis?: boolean, keepAspectRatio?: boolean }} [options]
 * @returns {{ board: any, boardId: string, destroy: () => void }}
 */
export function createBoard(mountNode, options = {}) {
  if (!window.JXG || !window.JXG.JSXGraph) {
    throw new Error('JSXGraph est requis pour cette animation.');
  }

  const boardId = `jxg-board-${++boardCounter}`;
  const boardContainer = document.createElement('div');
  boardContainer.id = boardId;
  boardContainer.className = 'jxgbox';
  mountNode.append(boardContainer);

  const board = window.JXG.JSXGraph.initBoard(boardId, {
    ...BOARD_OPTIONS,
    ...options,
  });

  return {
    board,
    boardId,
    destroy: () => {
      window.JXG.JSXGraph.freeBoard(board);
      boardContainer.remove();
    },
  };
}
