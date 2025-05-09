import { api } from '../../core/axios';
import { SignUpResponse, VerifyEmailValue } from './type';
import { User } from '../../store/useUserStore';
import { AxiosError } from 'axios';

export const signup = async ({
  username,
  password,
  nickname,
  gender,
  birthDate,
  email,
  agreedToTerms,
  agreedToPrivacy,
  agreedToLocation,
  agreedToMarketing,
}: SignUpResponse) => {
  try {
    const res = await api.service.post<SignUpResponse>('/api/v1/user', {
      username,
      password,
      nickname,
      gender,
      birthDate,
      email,
      agreedToTerms,
      agreedToPrivacy,
      agreedToLocation,
      agreedToMarketing,
    });
    return res && res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error('회원가입에 실패했습니다.');
    }
  }
};

export const checkDuplicateUsername = async (username: string | undefined) => {
  try {
    const res = await api.service.get(`/api/v1/user/username/${username}`);
    return res && res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error('username 중복조회 실패');
    }
  }
};

export const sendEmailCode = async (email: string) => {
  try {
    const res = await api.service.post(`/api/v1/user/email/send-mail`, email, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return res && res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data || '이메일 인증코드 전송 실패';
      throw new Error(message);
    }
  }
};

export const verifyEmailCode = async ({ email, code }: VerifyEmailValue) => {
  try {
    const res = await api.service.post<VerifyEmailValue>(`/api/v1/user/email/verify`, {
      email,
      code,
    });
    return res && res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data || '이메일 인증실패';
      throw new Error(message);
    }
  }
};

export const updateUserInfo = async (user: SignUpResponse) => {
  try {
    const res = await api.service.put<User>(`/api/v1/user/${user.id}`, user);
    return res && res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error('사용자 정보 업데이트 실패');
    }
  }
};
