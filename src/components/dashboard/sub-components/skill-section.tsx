'use client';

import {
  Button,
  Col,
  ConfigProvider,
  Form,
  FormProps,
  Image,
  Input,
  message,
  Row,
  Upload,
  UploadProps,
} from 'antd';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import '../asset/home-page.css';
import { DeleteFilled, UploadOutlined } from '@ant-design/icons';
import { TFile } from '@/types';
import {
  createSkillItemServices,
  revalidateSkills,
  updateSkillDataServices,
} from '@/services/HomeServices';
import { SkillType } from '@/types/home-page';

const { TextArea } = Input;
interface updateSkillParams {
  currSkill: SkillType | null;
  setCurrSkill: React.Dispatch<React.SetStateAction<SkillType | null>>;
}

export default function SkillSection({
  currSkill,
  setCurrSkill,
}: updateSkillParams) {
  const [form] = Form.useForm();
  let toastId: string | number = 'hero-section';

  useEffect(() => {
    if (currSkill) {
      form.resetFields();
      form.setFieldsValue({
        name: currSkill.name,
        description: currSkill.description,
        skill_icon: currSkill.skill_icon,
      });
    }
  }, [currSkill]);

  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      toastId = toast.loading('...Loading', { id: toastId });

      const { skill_icon = { fileList: [] }, ...rest } = values;

      const formData = new FormData();

      if (typeof skill_icon !== 'string') {
        skill_icon.fileList.forEach((file: TFile) => {
          if (file.originFileObj instanceof Blob) {
            formData.append('skill_icon', file.originFileObj);
          }
        });
      }

      const formObj = {
        ...rest,
        _id: currSkill?._id,
      };

      formData.append('data', JSON.stringify(formObj));

      let res;
      if (!currSkill) {
        res = await createSkillItemServices(formData);
      } else {
        res = await updateSkillDataServices(formData);
      }

      if (res?.success) {
        await revalidateSkills();
        setCurrSkill(null);
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
    setCurrSkill({ ...currSkill, skill_icon: '' } as SkillType);
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
              {currSkill && (
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
                    {currSkill.skill_icon && (
                      <div className="preview-image">
                        {currSkill && (
                          <Image
                            src={currSkill.skill_icon as string}
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
