import { render } from '@testing-library/react';
import { AuthBtn } from '../AuthBtn';
import { useUserStore } from '@/store/user';

jest.mock('@/store/user');

const mockUseUserStore = useUserStore as unknown as jest.MockedFunction<typeof useUserStore>;

describe('AuthBtn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button when permission is granted', () => {
    mockUseUserStore.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(true),
    } as never);

    const { getByText } = render(<AuthBtn permission="user:view">测试按钮</AuthBtn>);
    expect(getByText('测试按钮')).toBeTruthy();
  });

  it('should not render button when permission is denied', () => {
    mockUseUserStore.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(false),
    } as never);

    const { queryByText } = render(<AuthBtn permission="user:view">测试按钮</AuthBtn>);
    expect(queryByText('测试按钮')).toBeNull();
  });

  it('should render button when no permission is required', () => {
    mockUseUserStore.mockReturnValue({
      hasPermission: jest.fn(),
    } as never);

    const { getByText } = render(<AuthBtn>测试按钮</AuthBtn>);
    expect(getByText('测试按钮')).toBeTruthy();
  });
});
