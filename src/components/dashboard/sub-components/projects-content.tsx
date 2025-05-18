'use client';

import { Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import ProjectCreate from './create-project';
import ProjectList from './project-list';
import { TStoredProject } from '@/types';

export default function ProjectSection() {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [currProject, setCurrProject] = useState<TStoredProject | null>(null);

  const updateProjectFn = (tabNumber: string, project: TStoredProject) => {
    setActiveTab(tabNumber);
    setCurrProject(project);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Project Create',
      children: (
        <ProjectCreate
          currProject={currProject}
          setCurrProject={setCurrProject}
        />
      ),
    },
    {
      key: '2',
      label: 'Project List',
      children: (
        <ProjectList updateProjectFn={updateProjectFn} activeKey={activeTab} />
      ),
    },
  ];

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <>
      {' '}
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        items={items}
        onChange={onChange}
      />
    </>
  );
}
