'use client';

import {
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Flex,
  Form,
  FormProps,
  Input,
  message,
  Row,
  Select,
  UploadProps,
} from 'antd';
import React from 'react';
import { toast } from 'sonner';
import '../asset/home-page.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function WorkExperienceSection() {
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

  return (
    <>
      <Row gutter={[16, 16]} className="homepage-experience-container">
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
                  optionFontSize: 11,
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
              <Form.Item<any>
                label="Company Name"
                name="company_name"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please write your Company name!',
                  },
                ]}
              >
                <Input
                  placeholder="Enter your company name"
                  className="company-name"
                />
              </Form.Item>
              <Flex gap="middle">
                <Form.Item<any>
                  label="Start Date"
                  name="start_date"
                  className="label-input"
                  rules={[
                    {
                      required: true,
                      message: 'Please select start date!',
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item<any>
                  label="End Date"
                  name="end_date"
                  className="label-input"
                  rules={[
                    {
                      required: true,
                      message: 'Please select end date!',
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Flex>
              <Form.Item<any>
                name="currently_working"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please specify if you currently work here!',
                  },
                ]}
              >
                <Checkbox className="working-status">
                  <span>Currently work here</span>
                </Checkbox>
              </Form.Item>
              <Form.Item<any>
                label="Designation"
                name="designation"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your designation!',
                  },
                ]}
              >
                <Select
                  defaultValue="junior-developer"
                  style={{
                    width: '300px',
                  }}
                  size="middle"
                  options={[
                    {
                      value: 'junior-developer',
                      label: (
                        <span className="designation">Junior Developer</span>
                      ),
                    },
                    {
                      value: 'developer',
                      label: <span className="designation">Developer</span>,
                    },
                    {
                      value: 'senior-developer',
                      label: (
                        <span className="designation">Senior Developer</span>
                      ),
                    },
                  ]}
                />
              </Form.Item>
              <Form.List name="names">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        label={index === 0 ? 'Responsibilities' : ''}
                        required={false}
                        key={field.key}
                        style={{ width: '100%!important' }}
                      >
                        <Flex
                          justify="flex-start"
                          gap="middle"
                          align="flex-start"
                          style={{ height: '32px' }}
                        >
                          <Form.Item
                            {...field}
                            style={{ width: '100%!important' }}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: 'Please input your responsibility',
                              },
                            ]}
                          >
                            <Input placeholder="Write responsibility" />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              style={{ marginTop: '8px' }}
                              onClick={() => remove(field.name)}
                            />
                          ) : null}
                        </Flex>
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Flex justify="flex-end" align="center">
                        <Button
                          type="default"
                          onClick={() => add()}
                          style={{
                            color: '#034c53',
                            border: 'none',
                            width: '100px',
                          }}
                          icon={
                            <PlusOutlined
                              style={{ width: 'var(--label-font-size)' }}
                            />
                          }
                        >
                          <span className="add-field">Add field</span>
                        </Button>
                      </Flex>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item label={null}>
                <Button className="experience-submit-button" htmlType="submit">
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
