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

const { TextArea } = Input;

export default function SkillSection() {
  const [form] = Form.useForm();
  let toastId: string | number = 'hero-section';

  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      //   toastId = toast.loading('...Loading', { id: toastId });
      console.log('skill section info', values);
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
              className="project-form"
              name="basic"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: 'flex',
                      rowGap: 16,
                      flexDirection: 'column',
                    }}
                  >
                    {fields.map((field) => (
                      <Card
                        size="small"
                        title={`Technology detail ${field.name + 1}`}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        }
                      >
                        <Form.Item
                          label="Technology Name"
                          name={[field.name, 'name']}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter skill name',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item<any>
                          label="Skill description"
                          name={[field.name, 'description']}
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
                          name={[field.name, 'skill_icon']}
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
                      </Card>
                    ))}

                    <Flex justify="flex-end" align="center">
                      {' '}
                      <Button
                        type="default"
                        style={{
                          color: '#034c53',
                          border: 'none',
                          width: '100px',
                        }}
                        onClick={() => add()}
                        block
                      >
                        + Add Item
                      </Button>
                    </Flex>
                  </div>
                )}
              </Form.List>

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
