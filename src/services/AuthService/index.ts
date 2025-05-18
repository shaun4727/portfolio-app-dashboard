'use server';
import { FieldTypeLogin } from '@/types';
import { cookies } from 'next/headers';

export const loginUser = async (userData: FieldTypeLogin) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result.success) {
      (await cookies()).set('PortFolioAdminAccessToken', result.data.token);
      (await cookies()).set(
        'PortFolioAdminRefreshToken',
        result.data.refreshToken
      );
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getNewToken = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await cookies()).get('PortFolioAdminRefreshToken')!.value}`,
        },
      }
    );

    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  (await cookies()).delete('PortFolioAdminAccessToken');
  (await cookies()).delete('PortFolioAdminRefreshToken');
};
