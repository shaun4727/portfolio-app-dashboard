'use client';

import { Tabs, TabsProps } from 'antd';
import React, { useState } from 'react';
import { SkillType } from '@/types/home-page';
import SkillSection from './skill-section';
import SkillSectionList from './skill-section-list';

export default function SkillSectionContent({
  skillData,
}: {
  skillData: SkillType[];
}) {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [currSkill, setCurrSkill] = useState<SkillType | null>(null);

  const updateHeroFn = (tabNumber: string, skill: SkillType) => {
    setActiveTab(tabNumber);
    setCurrSkill(skill);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Skill Create',
      children: (
        <SkillSection currSkill={currSkill} setCurrSkill={setCurrSkill} />
      ),
    },
    {
      key: '2',
      label: 'Hero Section List',
      children: (
        <SkillSectionList
          updateHeroFn={updateHeroFn}
          skillListData={skillData}
          activeKey={activeTab}
        />
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
