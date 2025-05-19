'use client';

import React, { useEffect, useState } from 'react';

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
  UploadFile,
  UploadProps,
} from 'antd';
import { toast } from 'sonner';
import { TLinkObj, TProjectType, TStoredProject } from '@/types';
import '../asset/projects-content.css';
import { DeleteFilled, UploadOutlined } from '@ant-design/icons';
import {
  createProjectServices,
  revalidateProjects,
  updateProjectServices,
} from '@/services/ProjectServices';

const { TextArea } = Input;

interface updateProjectParams {
  currProject: TStoredProject | null;
  setCurrProject: React.Dispatch<React.SetStateAction<TStoredProject | null>>;
}

export default function ProjectCreate({
  currProject,
  setCurrProject,
}: updateProjectParams) {
  const [form] = Form.useForm();
  const [skipResettingImages, setSkipResettingImages] =
    useState<boolean>(false);
  const [fileListImages, setFileListImages] = useState<UploadFile[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<UploadFile[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [imagesKey, setImagesKey] = useState<TLinkObj[]>([]);
  let toastId: string | number = 'contact';

  useEffect(() => {
    if (projectName && currProject) {
      setFileListImages([]);
      setThumbnailFile([]);
      setImagesKey([]);
      form.resetFields();
      form.setFieldsValue({
        name: currProject.name,
        link: currProject.link,
        overview: currProject.overview,
      });
    }
  }, [projectName]);

  useEffect(() => {
    if (currProject) {
      setProjectName(currProject.name);
    }
  }, [currProject]);

  const props: UploadProps = {
    name: 'file',
    // fileList: thumbnailFile,
    beforeUpload: (file) => {
      // Prevent upload if existing thumbnail
      if (currProject?.images.length === 3) {
        toastId = toast.error('Please remove an image to replace it', {
          id: toastId,
        });
        return Upload.LIST_IGNORE;
      }
      setFileListImages((prev) => {
        return [...prev, file];
      });
      return true;
    },
    maxCount: 3,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
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
  const thumbnailProps: UploadProps = {
    name: 'Thumbnail-file',
    // fileList: fileList,
    // onRemove: () => {
    //   setFileList([]);
    //   return true;
    // },
    beforeUpload: (file) => {
      // Prevent upload if existing thumbnail
      if (currProject?.thumbnail) {
        toastId = toast.error('Please remove existing thumbnail first', {
          id: toastId,
        });
        return Upload.LIST_IGNORE;
      }
      setThumbnailFile((prev) => {
        return [...prev, file];
      });
      return true;
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} uploaded successfully`);
        // setFileList(info.fileList);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} upload failed`);
      }
      //   else {
      //     setFileList(info.fileList);
      //   }
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

  const imagesRequired = (images: UploadFile[]) => {
    if (
      currProject &&
      currProject.images &&
      currProject.images.length + images.length < 3
    ) {
      return true;
    } else if (!currProject && images.length < 3) {
      return true;
    }
    return false;
  };

  const thumbnailRequired = () => {
    if (currProject && currProject.thumbnail) {
      return false;
    }
    return true;
  };

  const onFinish: FormProps<TProjectType>['onFinish'] = async (values) => {
    const {
      thumbnail = { fileList: [] },
      images = { fileList: [] },
      ...rest
    } = values;

    try {
      toastId = toast.loading('...Loading', { id: toastId });

      const formData = new FormData();

      images.fileList?.forEach((file) => {
        if (file.originFileObj instanceof Blob) {
          formData.append('images', file.originFileObj);
        }
      });
      thumbnail.fileList.forEach((file) => {
        if (file.originFileObj instanceof Blob) {
          formData.append('thumbnail', file.originFileObj);
        }
      });
      const formObj = {
        ...rest,
        imagesKey,
        _id: currProject?._id,
      };

      formData.append('data', JSON.stringify(formObj));
      let res;
      if (!projectName) {
        res = await createProjectServices(formData);
      } else {
        res = await updateProjectServices(formData);
      }

      if (res?.success) {
        await revalidateProjects();
        form.resetFields();
        setCurrProject({
          _id: '',
          name: '',
          thumbnail: '',
          overview: '',
          link: '',
          images: [],
        });
        setProjectName('');
        toast.success(res?.message, { id: toastId });
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };

  const deleteThumbnail = () => {
    setCurrProject({ ...currProject, thumbnail: '' } as TStoredProject);
  };
  const deleteImages = (indexNumber: number) => {
    setImagesKey((preValue) => {
      return [...preValue, { link: '', key: indexNumber }];
    });

    setCurrProject((prev) => {
      if (!prev || !prev.images || prev.images.length === 0) return prev;

      const updatedImages = prev.images.filter(
        (_, index) => index !== indexNumber
      );

      return {
        ...prev,
        images: updatedImages,
      } as TStoredProject;
    });
  };

  return (
    <Row gutter={[16, 16]} className="project-container">
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
        <ConfigProvider
          theme={{
            components: {
              Form: {
                /* here is your component tokens */
                labelColor: '#000',
              },
            },
            token: { fontSize: 14 },
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
            <Form.Item<TProjectType>
              label="Name"
              name="name"
              className="label-input"
              rules={[
                { required: !currProject, message: 'Please input your name!' },
              ]}
            >
              <Input
                placeholder="Enter your project name"
                className="project-name"
              />
            </Form.Item>
            <Form.Item<TProjectType>
              label="Project Link"
              name="link"
              className="label-input"
              rules={[
                {
                  required: !currProject,
                  message: 'Please enter project link',
                },
              ]}
            >
              <Input placeholder="Enter your email" className="input" />
            </Form.Item>
            <Form.Item<TProjectType>
              label="Overview"
              name="overview"
              className="label-input"
              rules={[
                { required: !currProject, message: 'Write project overview!' },
              ]}
            >
              <TextArea
                showCount
                maxLength={219}
                placeholder="Type project overview"
                style={{ height: 120, resize: 'none' }}
              />
            </Form.Item>
            <Form.Item<TProjectType>
              label="Thumbnail"
              name="thumbnail"
              className="label-input"
              rules={[
                {
                  required: thumbnailRequired(),
                  message: 'Upload thumbnail!',
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
            {currProject && (
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
                  {currProject.thumbnail && (
                    <div className="preview-image">
                      {currProject && (
                        <Image
                          src={currProject.thumbnail}
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
            <Form.Item<TProjectType>
              label="Images"
              name="images"
              className="label-input"
              rules={[
                {
                  required: imagesRequired(fileListImages),
                  message: 'Upload images!',
                },
              ]}
            >
              <Upload className="project-upload" {...props} multiple={true}>
                <Button
                  className="create-project-button"
                  icon={<UploadOutlined />}
                >
                  Click to Upload (Max:3)
                </Button>
              </Upload>
            </Form.Item>
            {currProject && (
              <>
                {' '}
                <Row gutter={[16, 16]} className="edit-project-container">
                  {currProject.images.map((image, index) => (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={8}
                      xl={8}
                      className="gutter-row"
                      key={index}
                    >
                      {' '}
                      <div className="preview-image">
                        <Image src={image.link} alt="project-image" />
                        <DeleteFilled
                          style={{ color: 'red', cursor: 'pointer' }}
                          onClick={() => deleteImages(index)}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </>
            )}
            <Form.Item label={null}>
              <Button className="project-submit-button" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </Col>
    </Row>
  );
}
