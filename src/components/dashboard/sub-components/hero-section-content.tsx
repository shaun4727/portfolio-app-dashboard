'use client';

import { Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import HeroSection from './hero-section';
import { HeroSectionDataType } from '@/types/home-page';
import HeroSectionList from './hero-section-list';
import { getHeroDataListServices } from '@/services/HomeServices';

export default function HeroSectionContent({
  heroData,
}: {
  heroData: HeroSectionDataType[];
}) {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [currHero, setCurrHero] = useState<HeroSectionDataType | null>(null);

  const updateHeroFn = (tabNumber: string, hero: HeroSectionDataType) => {
    setActiveTab(tabNumber);
    setCurrHero(hero);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Hero Section Create',
      children: (
        <HeroSection
          currHero={currHero}
          setCurrHero={setCurrHero}
          disableSubmit={heroData.length}
        />
      ),
    },
    {
      key: '2',
      label: 'Hero Section List',
      children: (
        <HeroSectionList
          updateHeroFn={updateHeroFn}
          heroListData={heroData}
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
