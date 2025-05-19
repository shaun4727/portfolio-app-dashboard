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
  Image,
  UploadProps,
} from 'antd';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import '../asset/home-page.css';
import { DeleteFilled, UploadOutlined } from '@ant-design/icons';
import { HeroSectionDataType } from '@/types/home-page';
import {
  createHeroSectionServices,
  revalidateHeroes,
  updateHeroDataServices,
} from '@/services/HomeServices';

const { TextArea } = Input;

interface updateHeroParams {
  currHero: HeroSectionDataType | null;
  disableSubmit: number;
  setCurrHero: React.Dispatch<React.SetStateAction<HeroSectionDataType | null>>;
}

export default function HeroSection({
  currHero,
  setCurrHero,
  disableSubmit,
}: updateHeroParams) {
  const [form] = Form.useForm();
  let toastId: string | number = 'hero-section';

  useEffect(() => {
    if (currHero) {
      form.resetFields();
      form.setFieldsValue({
        stack: currHero.stack,
        tagline: currHero.tagline,
        thumbnail: currHero.thumbnail,
        about_me: currHero.about_me,
      });
    }
  }, [currHero]);

  const onFinish: FormProps<HeroSectionDataType>['onFinish'] = async (
    values
  ) => {
    try {
      toastId = toast.loading('...Loading', { id: toastId });

      const { thumbnail = { fileList: [] }, ...rest } = values;

      const formData = new FormData();
      if (typeof values.thumbnail !== 'string') {
        values.thumbnail.fileList.forEach((file) => {
          if (file.originFileObj instanceof Blob) {
            formData.append('thumbnail', file.originFileObj);
          }
        });
      }

      const formObj = {
        ...rest,
        _id: currHero?._id,
      };

      formData.append('data', JSON.stringify(formObj));

      let res;
      if (!currHero) {
        res = await createHeroSectionServices(formData);
      } else {
        res = await updateHeroDataServices(formData);
      }

      if (res?.success) {
        await revalidateHeroes();
        setCurrHero(null);
        form.resetFields();

        toast.success(res?.message, { id: toastId });
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };

  const deleteThumbnail = () => {
    setCurrHero({ ...currHero, thumbnail: '' } as HeroSectionDataType);
  };

  const thumbnailProps: UploadProps = {
    name: 'profile-thumbnail-file',

    beforeUpload: (file) => {
      // Prevent upload if existing thumbnail

      if (currHero?.thumbnail) {
        toastId = toast.error('Please remove existing thumbnail first', {
          id: toastId,
        });
        return Upload.LIST_IGNORE;
      }

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
              <Form.Item<HeroSectionDataType>
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
              <Form.Item<HeroSectionDataType>
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
              <Form.Item<HeroSectionDataType>
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
              <Form.Item<HeroSectionDataType>
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
              {currHero && (
                <Row gutter={[16, 16]} className="edit-project-container">
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={8}
                    xl={8}
                    className="gutter-row"
                  >
                    {' '}
                    {currHero.thumbnail && (
                      <div className="preview-image">
                        {currHero && (
                          <Image
                            src={currHero.thumbnail as string}
                            alt="project-image"
                          />
                        )}
                        <DeleteFilled
                          style={{ color: 'red', cursor: 'pointer' }}
                          onClick={() => deleteThumbnail()}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
              )}
              {disableSubmit > 0 && !currHero && (
                <div className="heading-note">
                  <h1>
                    Hero Section data exists. You can update it from
                    <span style={{ color: 'purple' }}> Hero Section List</span>
                  </h1>
                </div>
              )}

              <Form.Item label={null}>
                <Button
                  disabled={disableSubmit > 0 && !currHero ? true : false}
                  className="home-submit-button"
                  htmlType="submit"
                >
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
