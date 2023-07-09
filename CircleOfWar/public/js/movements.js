const keyStates = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false
};

function handleKeyDown(e) {
  const { code } = e;
  if (keyStates.hasOwnProperty(code)) {
    keyStates[code] = true;
    socket.emit('move', socket.id, circle.x, circle.y);
  }
}

function handleKeyUp(e) {
  const { code } = e;
  if (keyStates.hasOwnProperty(code)) {
    keyStates[code] = false;
    socket.emit('move', socket.id, circle.x, circle.y);
  }
}