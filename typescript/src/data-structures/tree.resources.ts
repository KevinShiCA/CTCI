import { BinaryTreeNode } from "tree";

/**
 *     50
 *   /    \
 * 25     80
 *  \    /  \
 *  30  60  90
 *          /
 *         85
 */
export const BinarySearchTreeA = [50, 25, 30, 80, 60, 90, 85];

/**
 *        50
 *      /    \
 *    -1     100
 *   /  \       \
 * -30  20      300
 *     /  \     /  \
 *    10  30  200  400
 */
export const BinarySearchTreeB = [50, -1, 100, -30, 20, 300, 10, 30, 200, 400];

/**
 *     50
 *   /    \
 * 25     80
 *  \    /  \
 *  30  60  90
 *          /
 *         85
 *          \
 *          87
 */
export const BinarySearchTreeC = [50, 25, 30, 80, 60, 90, 85, 87];

/**
 *        50
 *      /    \
 *    -1     100
 *   /  \       \
 * -30  20      300
 *     /  \     /  \
 *    10  30  200  400
 *    /
 *   5
 */
export const BinarySearchTreeD = [50, -1, 100, -30, 20, 300, 10, 30, 200, 400, 5];

/**
 *           6
 *          /
 *         5
 *        /
 *       4
 *      /
 *     3
 *    /
 *   2
 *  /
 * 1
 */
export const BinarySearchTreeE = [6, 5, 4, 3, 2, 1];

/**
 *     50
 *   /    \
 * 25     80
 *  \    /  \
 *  30  60  90
 *          /
 *         85
 */
export const BinaryTreeA: BinaryTreeNode<number> = {
  value: 50,
  left: {
    value: 25,
    right: {
      value: 30
    }
  },
  right: {
    value: 80,
    left: {
      value: 60
    },
    right: {
      value: 90,
      left: {
        value: 85
      }
    }
  }
};

/**
 *     50
 *   /    \
 * 25     80
 *  \    /  \
 *  30  60  90
 *          / \
 *         85 100
 *            / \
 *           95 110
 */
export const BinaryTreeB: BinaryTreeNode<number> = {
  value: 50,
  left: {
    value: 25,
    right: {
      value: 30
    }
  },
  right: {
    value: 80,
    left: {
      value: 60
    },
    right: {
      value: 90,
      left: {
        value: 85
      },
      right: {
        value: 100,
        left: {
          value: 95
        },
        right: {
          value: 110
        }
      }
    }
  }
};

/**
 *       1
 *      /
 *     2
 *    /
 *   3
 *  /
 * 4
 */
export const BinaryTreeC: BinaryTreeNode<number> = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 3,
      left: {
        value: 4
      }
    }
  }
};
