'use server';
import { getValidToken } from '@/lib/verifyToken';
import { MessageType } from '@/types';
import { revalidateTag } from 'next/cache';

export const sendMessageService = async (messageData: MessageType) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/message/send-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      }
    );
    const result = await res.json();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getMessageService = async () => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/message/get-message`,

      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        next: { tags: ['messages'] },
      }
    );
    const result = await res.json();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const updateReadingStatus = async (id: string) => {
  const token = await getValidToken();
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/message/update-message/${id}`,

      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteReadingStatus = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/message/update-message/${id}`,

      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const revalidateMessages = async () => {
  revalidateTag('messages');
};
