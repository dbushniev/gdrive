enum Keys {
  PageUp = 'PageUp',
  PageDown = 'PageDown'
}

const KEYS: {[key: string]: string} = {
  [Keys.PageDown]: 'PageDown',
  [Keys.PageUp]: 'PageUp',
}

const scrollControl = (e: KeyboardEvent, list: HTMLElement) => {
  if (list.scrollHeight > list.clientHeight && KEYS[e.key]) {
    e.preventDefault();
    if (KEYS[e.key] === KEYS[Keys.PageDown]) return list.scrollTop += 100;
    return list.scrollTop += -100
  }
}

export default scrollControl;