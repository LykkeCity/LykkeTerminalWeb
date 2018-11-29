import rem from 'polished/lib/helpers/rem';
import React from 'react';
import styled, {css} from 'styled-components';
import {Side as SideModel} from '../../models';

const theme = {
  bg: '#333',
  colors: {
    text: '#fff',
    [SideModel.Buy]: '#46eb6a',
    [SideModel.Sell]: '#ff6161'
  },
  font: rem(14),
  type: {
    color: '#8c94a0',
    active: {
      color: '#fff'
    }
  },
  side: {
    bg: '#272727',
    color: '#8c94a0'
  },
  total: {
    color: '#8c94a0'
  }
};

const OrderForm = styled.div`
  background: ${theme.bg};
  color: ${theme.colors.text};
  font-size: ${theme.font};
`;

const Type = styled.div`
  color: ${theme.type.color};
  display: flex;
  font-size: 1.2em;
  padding: 0.5em 0;
  position: relative;
  ::after {
    content: '';
    border-radius: 0.5px;
    background-color: #2f2f2f;
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
` as any;

Type.Option = styled.div`
  cursor: pointer;
  margin-right: 1.5em;
  position: relative;
  ${(p: any) =>
    p.active &&
    css`
       {
        color: ${theme.type.active.color};
        cursor: initial;
        font-weight: bold;
        ::after {
          content: '';
          background-color: #0388ef;
          border-radius: 1px;
          height: 2px;
          width: 100%;
          position: absolute;
          bottom: -0.5em;
          left: 0;
          z-index: 1;
        }
      }
    `};
`;

const Side = styled.div`
  color: ${theme.side.color};
  display: flex;
  justify-items: center;
  padding: 1em 0 1.2em;
` as any;

Side.Option = styled(
  ({
    field: {name, value, onChange, onBlur},
    form: {errors, touched, setFieldValue},
    id,
    label,
    className,
    ...props
  }: any) => (
    <div className={className}>
      <input
        name={name}
        id={id}
        type="radio"
        value={id}
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
)`
  flex: 1;
  margin-right: 0.5em;
  :last-child {
    margin-right: 0;
  }
  input {
    position: absolute;
    left: -9999px;
  }
  label {
    background: ${theme.side.bg};
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    font-weight: bold;
    padding: 0.5em 0;
    text-align: center;
    width: 100%;
  }
  input[type='radio']:checked + label {
    background: ${p => theme.colors[p.field.value]};
    color: white;
    cursor: initial;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1em;
  position: relative;
`;

const Label = styled.label`
  color: ${theme.colors.text};
  display: block;
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const Input = styled.input`
  border: solid 1px #56595e;
  background: none;
  border-radius: 4px;
  color: ${theme.colors.text};
  margin-bottom: 0.5em;
  padding: 0.5em;
  width: 100%;
  ::placeholder {
    color: ${theme.colors.text};
  }
`;
Input.defaultProps = {
  autoComplete: 'off'
};

const FormField = ({label, name, ...formProps}: any) => (
  <FormGroup>
    <Label>{label}</Label>
    <Input id={name} name={name} {...formProps} />
  </FormGroup>
);

const Percentage = styled.div`
  display: flex;
  justify-content: space-between;
  > div:first-child > label::before {
    width: 0;
  }
` as any;

Percentage.Item = styled(
  ({
    field: {name, value, onChange, onBlur},
    form: {errors, touched, setFieldValue},
    id,
    label,
    className,
    ...props
  }: any) => (
    <div className={className}>
      <input
        type="radio"
        name={name}
        id={id}
        value={id}
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
)`
  border-collapse: collapse;
  flex: 1;
  input {
    position: absolute;
    left: -9999px;
  }
  label {
    border: solid 1px transparent;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    padding: 0.5em 1em;
    position: relative;
    text-align: center;
    width: 100%;
    ::before {
      content: '';
      border-radius: 0.5px;
      background-color: #56595e;
      height: 1em;
      width: 1px;
      position: absolute;
      left: -2px;
      top: 0.75em;
    }
    :hover {
      border: solid 1px #56595e;
    }
    :hover::before {
      left: -1px;
    }
  }
  input[type='radio']:checked + label {
    border: solid 1px #56595e;
  }
  input[type='radio']:checked + label::before {
    left: -1px;
  }
`;

const AvailableBalance = styled.div`
  color: #8c94a0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
`;

const Total = styled.div`
  border-radius: 4px;
  background-color: #2f2f2f;
  display: flex;
  justify-content: space-between;
  padding: 0.5em 1em;
  margin-bottom: 1.5rem;
` as any;

Total.Title = styled.div``;

Total.Value = styled.div`
  color: ${theme.total.color};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  background: #0388ef;
  border: none;
  border-radius: 4px;
  color: ${theme.colors.text};
  font-weight: bold;
  outline: none;
  padding: 1rem 3.5rem;
  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const GhostButton = styled(Button)`
  background: none;
  color: #0388ef;
`;

export {
  OrderForm,
  Type,
  Side,
  FormGroup,
  Input,
  Label,
  FormField,
  Percentage,
  AvailableBalance,
  Total,
  Actions,
  Button,
  GhostButton
};
