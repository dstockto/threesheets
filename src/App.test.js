import { render, screen } from '@testing-library/react';
import PhoneApp from './phoneApp/component/PhoneApp';

test('renders learn react link', () => {
  render(<PhoneApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
