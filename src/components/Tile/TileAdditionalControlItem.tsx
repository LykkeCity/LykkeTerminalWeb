import {observer} from 'mobx-react';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';

interface TileAdditionalControlProps {
  additionalControlStore: any;
  control: any;
  index: number;
}

const StyledSpan = styled.span`
  font-size: ${rem(14)};
  line-height: 1.14;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  margin-right: 5px;
  color: #8c94a0;
  padding: ${rem(8)} ${rem(18)};
  cursor: not-allowed;

  &.clickable {
    color: #f5f6f7;
    cursor: pointer;
  }
`;

const TileAdditionalControlItem: React.SFC<
  TileAdditionalControlProps
> = observer(({additionalControlStore, control, index}) => {
  const action = additionalControlStore.construct(
    control.actionParams.store,
    control.actionParams.method
  );
  const conditions = control.conditionsParams.every(
    (condition: any) =>
      !!additionalControlStore.construct(condition.store, condition.getter)
  );
  const click = () => (conditions ? action() : null);

  return (
    <StyledSpan
      className={conditions ? 'clickable' : ''}
      key={index}
      onClick={click}
    >
      {control.title}
    </StyledSpan>
  );
});

export default TileAdditionalControlItem;
