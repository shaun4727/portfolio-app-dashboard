'use client';

import React, { useEffect, useState } from 'react';

import { Col, Row, Table, TableProps } from 'antd';
import '../asset/projects-content.css';
import { TStoredProject } from '@/types';
import Image from 'next/image';
import { DeleteFilled, EyeFilled, FormOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getProjectListServices } from '@/services/ProjectServices';

interface ProjectListParams {
  updateProjectFn: (tabNumber: string, project: TStoredProject) => void;
  activeKey: string;
}

export default function ProjectList({
  updateProjectFn,
  activeKey,
}: ProjectListParams) {
  const changeTab = (record: TStoredProject) => {
    updateProjectFn('1', record);
  };
  const [projectList, setProjectList] = useState<TStoredProject[]>([]);

  const getAllProjectList = async () => {
    const res = await getProjectListServices();
    setProjectList(res.data);
  };

  useEffect(() => {
    getAllProjectList();
  }, [activeKey]);

  const columns: TableProps<TStoredProject>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: '1',
      fixed: 'left',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: '2',
      render: (_, { thumbnail }) => (
        <>
          <Image
            src={thumbnail}
            width={100}
            height={100}
            className="project-image"
            alt="project-image"
          />
        </>
      ),
    },
    {
      title: 'Visit',
      dataIndex: 'link',
      key: '3',
      render: (_, { link }) => (
        <>
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="link-class"
          >
            <EyeFilled style={{ cursor: 'pointer', color: 'green' }} />
          </Link>
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

            <DeleteFilled style={{ color: 'red', cursor: 'pointer' }} />
          </div>
        </>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]} className="project-list">
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
        <Table<TStoredProject>
          columns={columns}
          dataSource={projectList}
          scroll={{ x: 500 }}
        />
      </Col>
    </Row>
  );
}
