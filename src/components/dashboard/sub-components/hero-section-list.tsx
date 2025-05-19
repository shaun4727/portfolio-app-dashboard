'use client';

import React, { useEffect } from 'react';

import { Col, Row, Table, TableProps } from 'antd';
import '../asset/projects-content.css';
import Image from 'next/image';
import { FormOutlined } from '@ant-design/icons';
import { HeroSectionDataType } from '@/types/home-page';
import { revalidateHeroes } from '@/services/HomeServices';

interface HeroListParams {
  updateHeroFn: (tabNumber: string, hero: HeroSectionDataType) => void;
  activeKey: string;
  heroListData: HeroSectionDataType[];
}

export default function HeroSectionList({
  updateHeroFn,
  activeKey,
  heroListData,
}: HeroListParams) {
  const changeTab = (record: HeroSectionDataType) => {
    updateHeroFn('1', record);
  };

  useEffect(() => {
    revalidateHeroes();
  }, [activeKey]);

  const columns: TableProps<HeroSectionDataType>['columns'] = [
    {
      title: 'Stack',
      dataIndex: 'stack',
      key: '1',
      fixed: 'left',
    },
    {
      title: 'Profile Image',
      dataIndex: 'thumbnail',
      key: '2',
      render: (_, { thumbnail }) => (
        <>
          <Image
            src={thumbnail as string}
            width={100}
            height={100}
            className="hero-image"
            alt="hero-image"
          />
        </>
      ),
    },
    {
      title: 'Tag Line',
      dataIndex: 'tagline',
      key: '3',
      render: (_, { tagline }) => (
        <>
          <p>{tagline}</p>
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: '4',
      render: (_, record) => (
        <>
          <div style={{ display: 'flex', gap: 10 }}>
            <FormOutlined
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => changeTab(record)}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]} className="project-list">
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
        <Table<HeroSectionDataType>
          columns={columns}
          dataSource={heroListData}
          scroll={{ x: 500 }}
        />
      </Col>
    </Row>
  );
}
