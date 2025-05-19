'use client';

import { Button, Col, ConfigProvider, Form, FormProps, Input, Row } from 'antd';
import React, { useState } from 'react';
import { toast } from 'sonner';
import '../asset/home-page.css';
import TipTapClient from '@/components/editor/tiptapEditor';

const { TextArea } = Input;

export default function BlogSection() {
  const [form] = Form.useForm();
  const [contentVal, setContentVal] = useState<string>(
    '<p>Try uploading an image or write here!</p>'
  );
  let toastId: string | number = 'hero-section';

  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      //   toastId = toast.loading('...Loading', { id: toastId });
      console.log('blog section info', values);
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };

  return (
    <>
      <Row gutter={[16, 16]} className="blog-page-container">
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
            <div className="heading-note">
              <h1>There are Undo and Redo buttons to alter your Actions!</h1>
            </div>

            <Form
              className="blog-form"
              name="basic"
              form={form}
              initialValues={{
                content: '<p>Try uploading an image or write here!</p>',
              }}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item<any>
                label="Question"
                name="question"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please write the question',
                  },
                ]}
              >
                <Input
                  placeholder="Please write the question"
                  className="input"
                />
              </Form.Item>
              <Form.Item<any>
                label="Excerpt"
                name="excerpt"
                className="label-input"
                rules={[
                  {
                    required: true,
                    message: 'Please write the short description',
                  },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={300}
                  placeholder="Write short description"
                  style={{ height: 120, resize: 'none' }}
                />
              </Form.Item>
              <Form.Item
                label="Content"
                name="content"
                rules={[{ required: true, message: 'Please enter content' }]}
              >
                <TipTapClient onChange={setContentVal} value={contentVal} />
              </Form.Item>
              <Form.Item label={null}>
                <Button className="blog-submit-button" htmlType="submit">
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
