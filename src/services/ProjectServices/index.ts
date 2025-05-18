'use server';

import { getValidToken } from '@/lib/verifyToken';
import { revalidateTag } from 'next/cache';

export const createProjectServices = async (data: FormData) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/create-project`,

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

export const updateProjectServices = async (data: FormData) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/update-project`,

      {
        method: 'PATCH',
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

export const getProjectListServices = async () => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/project-list`,

      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ['projects'] },
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const revalidateProjects = async () => {
  revalidateTag('projects');
};

export const getProjectListForUserServices = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/project-list-for-user`,
      {
        method: 'GET',
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getSingleProjectForUserServices = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/get-single-project/${id}`,
      {
        method: 'GET',
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
