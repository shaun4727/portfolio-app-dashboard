'use server';

import { getValidToken } from '@/lib/verifyToken';

export const createHeroSectionServices = async (data: FormData) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/home/hero-section-create`,

      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
