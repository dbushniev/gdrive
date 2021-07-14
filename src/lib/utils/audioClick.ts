import Click from '../../assets/click.mp3';

type ClickDecorator = <T extends Function>(cb: T) => () => void

const audioClick: ClickDecorator = (cb) => {
  return (...rest) => {
    const audio = document.createElement('audio');
    audio.src = Click;
    audio.play();
    cb(rest);
  }
}

export default audioClick;