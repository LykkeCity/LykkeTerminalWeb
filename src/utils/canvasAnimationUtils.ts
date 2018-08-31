const ANIMATION_MAX_OPACITY = 0.6;
const ANIMATION_STEP_OPACITY = 0.1;

export interface ITransitionAnimationDetail {
  id: string;
  isFinished: boolean;
  isRising: boolean;
  currentOpacity: number;
}

export const getDefaultTransitionAnimationState = (id: string) => {
  return {
    id,
    isFinished: false,
    isRising: true,
    currentOpacity: ANIMATION_STEP_OPACITY
  };
};

export const updateTransitionState = (
  animation: ITransitionAnimationDetail
) => {
  if (animation.isRising && animation.currentOpacity < ANIMATION_MAX_OPACITY) {
    animation.currentOpacity += ANIMATION_STEP_OPACITY;
  } else {
    animation.isRising = false;
    animation.currentOpacity -= ANIMATION_STEP_OPACITY;
  }

  if (animation.currentOpacity < 0) {
    animation.isFinished = true;
  }
};
