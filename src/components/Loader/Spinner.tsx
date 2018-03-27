import styled, {colors} from '../styled';

export const Spinner = styled.div`
  @keyframes donut-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  display: inline-block;
  border: 4px solid ${colors.darkGraphite};
  border-left-color: ${colors.lightGraphite};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: donut-spin 1.2s linear infinite;
`;

export default Spinner;
