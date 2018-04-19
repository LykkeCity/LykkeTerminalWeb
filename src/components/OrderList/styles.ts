import {colorFromSide} from '../styled';
import {Cell} from '../Table/styles';

export const SideCell = Cell.extend`
  ${(p: any) => colorFromSide(p)};
` as any;
