export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}


export function observeChanges(obj, key, onRead, onWrite) {
  let val = obj[key];
  Object.defineProperty(obj, key, {
    set(v) {
      onWrite(v);
      val = v;
    },
    get() {
      onRead();
      return val;
    }
  })
}

/*
  Helper to keep two object changes in sync
  (b) read will trigger aUpdate if (a) has changes
  (a) read will trigger bUpdate if (b) has changes
*/
export function onChange(a, b, aUpdate, bUpdate) {
  let lock = false;
  let [ aDirty, bDirty ] = [ false, false ];
  const update = (a, b) => {
    if (!lock) {
      lock = true;
      if (a && aDirty) {
        aDirty = false;
        aUpdate();
      }
      if (b && bDirty) {
        bDirty = false;
        bUpdate();
      }
      lock = false;
    }
  }
  
  const onReadA = () => update(true, false);
  const onReadB = () => update(false, true);
  const onWriteA = () => [bDirty, aDirty] = [true, false];
  const onWriteB = () => [aDirty, bDirty] = [true, false];

  for (let key in a) {
    observeChanges(a, key, onReadA, onWriteA);
  }
  for (let key in b) {
    observeChanges(b, key, onReadB, onWriteB);
  }
}