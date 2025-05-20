'use client';

import {
  Button,
  Col,
  ConfigProvider,
  Drawer,
  Form,
  FormProps,
  Input,
  Row,
  Table,
  TableProps,
} from 'antd';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import '../asset/home-page.css';
import TipTapClient from '@/components/editor/tiptapEditor';
import { BlogType } from '@/types/home-page';
import {
  createBlogDataServices,
  getBlogDataServices,
  updateBlogDataServices,
} from '@/services/HomeServices';
import { EditFilled, EyeFilled } from '@ant-design/icons';

const { TextArea } = Input;

export default function BlogSection() {
  const [form] = Form.useForm();
  const [currBlog, setCurrBlog] = useState<BlogType | null>(null);
  const [blogData, setBlogData] = useState<BlogType[]>([]);
  const [open, setOpen] = useState(false);
  const [contentVal, setContentVal] = useState<string>(
    '<p>Try uploading an image or write here!</p>'
  );

  const [editMode, setEditMode] = useState<boolean>(false);

  let toastId: string | number = '1';

  const columns: TableProps<BlogType>['columns'] = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: '1',
      fixed: 'left',
    },
    {
      title: 'Short Content',
      dataIndex: 'excerpt',
      key: '2',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: '4',
      render: (_, record) => (
        <>
          <div style={{ display: 'flex', gap: 10 }}>
            <EditFilled
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => updateBlog(record)}
            />
            <EyeFilled
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => viewBlog(record)}
            />
          </div>
        </>
      ),
    },
  ];

  const getAllBlogs = async () => {
    try {
      const res = await getBlogDataServices();

      if (res?.success) {
        setBlogData(res.data);
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const updateBlog = (blog: BlogType) => {
    setEditMode(true);
    setCurrBlog(blog);
    form.resetFields();
    form.setFieldsValue({
      content: blog.content,
      excerpt: blog.excerpt,
      question: blog.question,
    });
    setContentVal(blog.content);
    showDrawer();
  };

  const viewBlog = (blog: BlogType) => {
    setEditMode(false);
    setCurrBlog(blog);
    showDrawer();
  };
  const onFinish: FormProps<BlogType>['onFinish'] = async (values) => {
    try {
      toastId = toast.loading('...Loading', { id: toastId });
      const obj = {
        ...values,
        _id: currBlog?._id,
      };

      let res;
      if (!currBlog) {
        res = await createBlogDataServices(obj as BlogType);
      } else {
        res = await updateBlogDataServices(obj as BlogType);
      }

      if (res?.success) {
        await getAllBlogs();
        onClose();
        setCurrBlog(null);
        form.resetFields();

        toast.success(res?.message, { id: toastId });
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const openDrawerToCreate = () => {
    setEditMode(true);
    setCurrBlog(null);
    form.resetFields();
    showDrawer();
  };

  return (
    <>
      <Row gutter={[16, 16]} className="blog-page-container">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
          <Button
            style={{
              backgroundColor: '#103559',
              height: '40px',
              marginBottom: '15px',
            }}
            onClick={() => openDrawerToCreate()}
          >
            {' '}
            <span
              style={{
                fontSize: '18px',
                fontWeight: '400',
                color: '#fff',
              }}
            >
              Create Blog
            </span>{' '}
          </Button>

          <Table<BlogType>
            columns={columns}
            dataSource={blogData}
            scroll={{ x: 500 }}
          />

          <Drawer
            title="Blog Content"
            closable={{ 'aria-label': 'Close Button' }}
            width={'65%'}
            onClose={onClose}
            open={open}
          >
            {!editMode && (
              <div>
                <h4 style={{ color: '#103559', marginBottom: '15px' }}>
                  {currBlog?.question}
                </h4>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    color: '#434343',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(currBlog?.content as string),
                  }}
                ></div>
              </div>
            )}
            {editMode && (
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
                  <h1>
                    There are Undo and Redo buttons to alter your Actions in
                    editor!
                  </h1>
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
                  <Form.Item<BlogType>
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
                  <Form.Item<BlogType>
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
                  <Form.Item<BlogType>
                    label="Content"
                    name="content"
                    rules={[
                      { required: true, message: 'Please enter content' },
                    ]}
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
            )}
          </Drawer>
        </Col>
      </Row>
    </>
  );
}
