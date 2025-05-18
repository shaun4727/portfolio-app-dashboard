'use client';

import React, { useEffect, useState } from 'react';
import { MessageType } from '@/types';

import { Col, Modal, Row, Table, TableProps, Tag } from 'antd';
import {
  deleteReadingStatus,
  getMessageService,
  revalidateMessages,
  updateReadingStatus,
} from '@/services/MessageService';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'sonner';

interface DashboardManagementProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MessageSection({
  setLoading,
}: DashboardManagementProps) {
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const [messageItem, setMessageItem] = useState<MessageType>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = async (record: MessageType) => {
    if (!record.seen) {
      await updateReadingStatus(record._id as string);
      await revalidateMessages();
      setLoading(true);
    }
    setMessageItem(record);
    setIsModalOpen(true);
  };

  const deleteMessageFn = async (record: MessageType) => {
    let toastId: string | number = 'contact';

    try {
      toastId = toast.loading('...Loading', { id: toastId });

      const res = await deleteReadingStatus(record._id as string);
      setMessageItem(record);

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: TableProps<MessageType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: '1',
      render: (_, { fullname }) => <p>{fullname}</p>,
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: '2',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '3',
      render: (_, record) => (
        <>
          {!record.seen && <Tag color={'red'}>NEW</Tag>}{' '}
          {record.seen && <Tag color={'green'}>SEEN</Tag>}
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: '4',
      render: (_, record) => (
        <>
          <div style={{ display: 'flex', gap: 5 }}>
            <EyeOutlined
              style={{ cursor: 'pointer', color: 'green' }}
              onClick={() => showModal(record)}
            />
            <DeleteOutlined
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => deleteMessageFn(record)}
            />
          </div>
        </>
      ),
    },
  ];

  const getAllMessages = async () => {
    const res = await getMessageService();

    if (res.success) {
      setAllMessages(
        res.data?.map((item: MessageType, index: number) => {
          return {
            ...item,
            key: index,
          };
        })
      );
    }
  };

  useEffect(() => {
    getAllMessages();
  }, [messageItem]);

  return (
    <Row gutter={[16, 16]} className="message-container">
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
        <Table<MessageType>
          columns={columns}
          dataSource={allMessages}
          scroll={{ x: 500 }}
        />
      </Col>
      <Modal
        title={
          <p>
            Message from{' '}
            <span style={{ color: '#034c53' }}>{messageItem?.fullname}</span>
          </p>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p style={{ fontSize: 'var(--regular-description-size-two)' }}>
          {messageItem?.message}
        </p>
      </Modal>
    </Row>
  );
}
