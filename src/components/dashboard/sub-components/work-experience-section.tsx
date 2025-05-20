'use client';

import {
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Drawer,
  Flex,
  Form,
  FormProps,
  Input,
  Row,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import '../asset/home-page.css';
import {
  EditFilled,
  EyeFilled,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ExperienceType } from '@/types/home-page';
import {
  createExperienceServices,
  getExperienceServices,
  updateExperienceDataServices,
} from '@/services/HomeServices';
import { useWatch } from 'antd/es/form/Form';

export default function WorkExperienceSection() {
  const [form] = Form.useForm();
  const currentlyWorking = useWatch('currently_working', form);
  let toastId: string | number = '1';
  const [open, setOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<boolean>(false);
  const [experienceList, setExperienceList] = useState<ExperienceType[]>([]);
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [currExperience, setCurrExperience] = useState<ExperienceType | null>(
    null
  );

  const getAllExperiences = async () => {
    try {
      const res = await getExperienceServices();
      //   console.log(res);
      if (res?.success) {
        setExperienceList(res.data);
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAllExperiences();
  }, [submitStatus]);

  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    let obj = {};
    if (currExperience) {
      obj = {
        ...values,
        end_date: values?.end_date?.format('YYYY-MM-DD'),
        start_date: values?.start_date?.format('YYYY-MM-DD'),
        _id: currExperience._id,
      };
    } else {
      obj = {
        ...values,
        end_date: values?.end_date?.format('YYYY-MM-DD'),
        start_date: values?.start_date?.format('YYYY-MM-DD'),
      };
    }

    try {
      toastId = toast.loading('...Loading', { id: toastId });
      setSubmitStatus(true);
      let res;
      if (!currExperience) {
        res = await createExperienceServices(obj as ExperienceType);
      } else {
        res = await updateExperienceDataServices(obj as ExperienceType);
        console.log('right section', res);
      }

      setSubmitStatus(false);
      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        await getAllExperiences();
        setCreateMode(false);
        setCurrExperience(null);
        form.resetFields();
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };
  const handleResponsibilityView = (experience: ExperienceType) => {
    setCurrExperience(experience);
    showDrawer();
  };

  const enableEditMode = (experience: ExperienceType) => {
    setCreateMode(true);
    setCurrExperience(experience);
    form.resetFields();
    form.setFieldsValue({
      company_name: experience.company_name,
      start_date: dayjs(experience.start_date),
      end_date: dayjs(experience.end_date),
      currently_working: experience.currently_working,
      designation: experience.designation,
      responsibilities: experience.responsibilities,
    });
  };

  return (
    <>
      <Row gutter={[16, 16]} className="homepage-experience-container">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="gutter-row">
          {!createMode && (
            <>
              {experienceList.length === 0 && (
                <div className="heading-note">
                  <h1>No Data to display!</h1>
                </div>
              )}

              {experienceList.length > 0 && (
                <div className="exp-details">
                  <h1 className="experience-title">Work Experiences:</h1>

                  {experienceList.map((experience, index) => (
                    <Card className="box-container box-shadow" key={index}>
                      <div className="overview">
                        <h4 className="exp-title">
                          <span className="heading">Company:</span>{' '}
                          <span className="heading-value">
                            {experience.company_name}
                          </span>
                        </h4>
                        <p className="exp-title">
                          <span className="heading">From:</span>{' '}
                          <span className="heading-value">
                            {experience.start_date?.split('-')[0]} -{' '}
                            {experience.currently_working === true
                              ? 'Present'
                              : experience.end_date?.split('-')[0]}
                          </span>
                        </p>
                        <h4 className="exp-title">
                          <span className="heading">Designation:</span>{' '}
                          <span className="heading-value capital-case">
                            {experience.designation.split('-').join(' ')}
                          </span>
                        </h4>
                        <Button
                          style={{
                            backgroundColor: '#103559',
                            height: '40px',
                            marginTop: '15px',
                          }}
                          onClick={() => handleResponsibilityView(experience)}
                        >
                          {' '}
                          <span
                            style={{
                              fontSize: '18px',
                              fontWeight: '400',
                              color: '#fff',
                            }}
                          >
                            View Responsibility
                          </span>{' '}
                        </Button>
                      </div>
                      <div className="edit-container">
                        <EditFilled
                          className="edit-icon"
                          onClick={() => enableEditMode(experience)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
          {createMode && (
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
              <div className="view-container">
                <EyeFilled
                  className="edit-icon"
                  onClick={() => setCreateMode(false)}
                />
              </div>
              <Form
                className="project-form"
                name="basic"
                initialValues={{
                  responsibilities: [''],
                }}
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item<ExperienceType>
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
                  <Form.Item<ExperienceType>
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
                  {!currentlyWorking && (
                    <Form.Item<ExperienceType>
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
                  )}
                </Flex>
                <Form.Item<ExperienceType>
                  name="currently_working"
                  className="label-input"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              'Please specify if you currently work here!'
                            ),
                    },
                  ]}
                >
                  <Checkbox className="working-status">
                    <span>Currently work here</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item<ExperienceType>
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
                    defaultValue="default"
                    style={{
                      width: '300px',
                    }}
                    size="middle"
                    options={[
                      {
                        value: 'default',
                        label: (
                          <span className="designation">Select a option</span>
                        ),
                      },
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
                <Form.List name="responsibilities">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          label={index === 0 ? 'Responsibilities' : ''}
                          required={false}
                          key={field.key}
                        >
                          <Flex
                            justify="flex-start"
                            gap="middle"
                            className="responsibility-field"
                            align="flex-start"
                            style={{
                              height: '32px',
                              width: '100vw!important',
                            }}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: 'Please input your responsibility',
                                },
                              ]}
                            >
                              <Input
                                placeholder="Write responsibility"
                                className="responsibility-input"
                              />
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
                            <span className="add-field">
                              Add responsibility
                            </span>
                          </Button>
                        </Flex>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item label={null}>
                  <Button
                    className="experience-submit-button"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </ConfigProvider>
          )}

          <Drawer
            title="Responsibilities"
            closable={{ 'aria-label': 'Close Button' }}
            width={'65%'}
            onClose={onClose}
            open={open}
          >
            {currExperience?.responsibilities?.map((item, index) => (
              <p key={index}>
                {index + 1}. {item}
              </p>
            ))}
          </Drawer>
        </Col>
      </Row>
    </>
  );
}
