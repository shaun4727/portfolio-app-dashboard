'use client';

import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Flex,
  Form,
  FormProps,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
  UploadProps,
} from 'antd';
import React from 'react';
import { toast } from 'sonner';
import '../asset/home-page.css';
import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { TFile } from '@/types';
import { createSkillItemServices } from '@/services/HomeServices';
import { SkillType } from '@/types/home-page';

const { TextArea } = Input;

export default function SkillSection() {
  const [form] = Form.useForm();
  let toastId: string | number = 'hero-section';

  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      toastId = toast.loading('...Loading', { id: toastId });

      const { skill_icon = [], ...rest } = values;

      const formData = new FormData();

      skill_icon.forEach((file: TFile) => {
        if (file.originFileObj instanceof Blob) {
          formData.append('skill_icon', file.originFileObj);
        }
      });

      const formObj = {
        ...rest,
      };

      formData.append('data', JSON.stringify(formObj));

      const res = await createSkillItemServices(formData);
      console.log(res);
      if (res?.success) {
        // await revalidateHeroes();
        // setCurrHero(null);
        form.resetFields();

        toast.success(res?.message, { id: toastId });
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const thumbnailProps: UploadProps = {
    name: 'skill-icon-file',

    beforeUpload: (file) => {
      // Prevent upload if existing thumbnail
      return true;
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} upload failed`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <>
      <Row gutter={[16, 16]} className="homepage-skill-container">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
          <ConfigProvider
            theme={{
              token: {
                fontSize: 14,
                colorTextHeading: '#034c53',
              },
              components: {
                Form: {
                  /* here is your component tokens */
                  labelColor: '#000',
                },
                Select: {
                  optionSelectedBg: '#fff',
                  optionFontSize: 1,
                },
              },
            }}
          >
            <Form
              className="skill-form"
              name="basic"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item<SkillType>
                label="Technology Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter skill name',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item<SkillType>
                label="Skill description"
                name="description"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please enter skill description',
                  },
                ]}
              >
                <TextArea
                  showCount
                  placeholder="Enter skill description"
                  style={{ height: 120, resize: 'none' }}
                />
              </Form.Item>
              <Form.Item
                label="Skill Icon"
                name="skill_icon"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Upload skill icon!',
                  },
                ]}
              >
                <Upload className="skill-upload" {...thumbnailProps}>
                  <Button
                    style={{ fontSize: '14px' }}
                    className="create-skill-button"
                    icon={<UploadOutlined />}
                  >
                    Click to Upload (Max: 1)
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item label={null}>
                <Button className="skill-submit-button" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </ConfigProvider>
        </Col>
      </Row>
    </>
  );
}
