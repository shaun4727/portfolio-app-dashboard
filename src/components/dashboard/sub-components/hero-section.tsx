'use client';

import {
  Button,
  Col,
  ConfigProvider,
  Form,
  FormProps,
  Input,
  message,
  Row,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import React from 'react';
import { toast } from 'sonner';
import '../asset/home-page.css';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function HeroSection() {
  const [form] = Form.useForm();
  let toastId: string | number = 'hero-section';

  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      toastId = toast.loading('...Loading', { id: toastId });
      console.log('hero section info', values);
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };

  const thumbnailProps: UploadProps = {
    name: 'profile-thumbnail-file',

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
      <Row gutter={[16, 16]} className="homepage-hero-container">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
          <ConfigProvider
            theme={{
              token: {
                fontSize: 18,
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
              className="project-form"
              name="basic"
              initialValues={{ stack: 'frontend' }}
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item<any>
                label="Stack Type"
                name="stack"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please enter stack!',
                  },
                ]}
              >
                <Select
                  defaultValue="frontend"
                  style={{
                    width: '300px',
                  }}
                  size="middle"
                  options={[
                    { value: 'frontend', label: 'Frontend' },
                    { value: 'backend', label: 'Backend' },
                    { value: 'full-stack', label: 'Full Stack' },
                  ]}
                />
              </Form.Item>
              <Form.Item<any>
                label="Tag Line"
                name="tagline"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please enter tagline',
                  },
                ]}
              >
                <Input placeholder="Enter your tagline" className="input" />
              </Form.Item>
              <Form.Item<any>
                label="About Me"
                name="about_me"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please enter bio',
                  },
                ]}
              >
                <TextArea
                  showCount
                  placeholder="Enter Bio"
                  style={{ height: 120, resize: 'none' }}
                />
              </Form.Item>
              <Form.Item<any>
                label="Thumbnail"
                name="thumbnail"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Upload your image!',
                  },
                ]}
              >
                <Upload className="project-upload" {...thumbnailProps}>
                  <Button
                    className="create-project-button"
                    icon={<UploadOutlined />}
                  >
                    Click to Upload(Max:1)
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item label={null}>
                <Button className="home-submit-button" htmlType="submit">
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
