import styled from 'styled-components'

export const BasicButton = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 10px 16px;
  border: none;
  border-radius: 99px;
  background: transparent;
  color: #2f3130;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms ease, transform 160ms ease-out;

  &:hover {
    background-color: rgba(100, 104, 100, 0.08);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 3px #406cc4, inset 0 0 0 4px white;
  }

  &:active {
    background-color: rgba(100, 104, 100, 0.16);
    transform: scale(0.97);
  }
`
