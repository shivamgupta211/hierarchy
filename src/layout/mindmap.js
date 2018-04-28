
function secondWalk(node) {
  if (node.isLeaf()) {
    node.totalHeight = node.height;
  }
  let totalHeight = 0;
  node.children.forEach(c => {
    totalHeight += secondWalk(c);
  });
  node.totalHeight = Math.max(node.height, totalHeight);
  return node.totalHeight;
}
function thirdWalk(node) {
  const children = node.children;
  const len = children.length;
  if (len) {
    children.forEach(c => {
      thirdWalk(c);
    });
    const first = children[0];
    const last = children[len - 1];
    node.y = (first.y + first.height / 2 + last.y + last.height / 2) / 2 - node.height / 2;
  }
}

module.exports = root => {
  root.parent = {
    x: 0,
    width: 0,
    height: 0,
    y: 0
  };
  // first walk
  root.BFTraverse(node => {
    node.x = node.parent.x + node.parent.width; // simply get x
  });
  root.parent = null;
  // second walk
  secondWalk(root); // assign sub tree totalHeight
  // adjusting
  // separating nodes
  root.startY = 0;
  root.y = root.totalHeight / 2 - root.height / 2;
  root.eachNode(node => {
    const children = node.children;
    const len = children.length;
    if (len) {
      const first = children[0];
      first.startY = node.startY;
      if (len === 1) {
        first.totalHeight = node.totalHeight;
      }
      first.y = first.startY + first.totalHeight / 2 - first.height / 2;
      for (let i = 1; i < len; i++) {
        const c = children[i];
        c.startY = children[i - 1].startY + children[i - 1].totalHeight;
        c.y = c.startY + c.totalHeight / 2 - c.height / 2;
      }
    }
  });

  // third walk
  thirdWalk(root);
};