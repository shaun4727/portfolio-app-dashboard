'use client';

import React, { useEffect } from 'react';

import { Col, Row, Table, TableProps } from 'antd';
import '../asset/projects-content.css';
import Image from 'next/image';
import { FormOutlined } from '@ant-design/icons';
import { HeroSectionDataType, SkillType } from '@/types/home-page';
import { revalidateHeroes } from '@/services/HomeServices';

interface SkillListParams {
  updateHeroFn: (tabNumber: string, skill: SkillType) => void;
  activeKey: string;
  skillListData: SkillType[];
}

export default function SkillSectionList({
  updateHeroFn,
  activeKey,
  skillListData,
}: SkillListParams) {
  const changeTab = (record: SkillType) => {
    updateHeroFn('1', record);
  };

  //   useEffect(() => {
  //     revalidateHeroes();
  //   }, [activeKey]);

  const columns: TableProps<SkillType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: '1',
      fixed: 'left',
    },
    {
      title: 'Profile Image',
      dataIndex: 'thumbnail',
      key: '2',
      render: (_, { skill_icon }) => (
        <>
          <Image
            src={skill_icon as string}
            width={100}
            height={100}
            className="skill-image"
            alt="skill-image"
          />
        </>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: '3',
      render: (_, { description }) => (
        <>
          <p>{description}</p>
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
        <Table<SkillType>
          columns={columns}
          dataSource={skillListData}
          scroll={{ x: 500 }}
        />
      </Col>
    </Row>
  );
}
