'use client';

import './asset/login-section.css';
import { Button, Card, Col, Form, FormProps, Input, Row } from 'antd';
import { toast } from 'sonner';
import { FieldTypeLogin } from '@/types';
import { loginUser } from '@/services/AuthService';
import { useRouter } from 'next/navigation';

export default function LoginSection() {
  const router = useRouter();
  const onFinish: FormProps<FieldTypeLogin>['onFinish'] = async (values) => {
    let toastId: string | number = 'login';

    try {
      toastId = toast.loading('...Loading', { id: toastId });

      const userInfo = {
        email: values.email,
        password: values.password,
      };

      /**
       * email: shaunhossain655@gmail.com
       * password: @@shaun##hossain@@
       */
      const res = await loginUser(userInfo);

      console.log(res);
      if (res?.success) {
        router.push('/dashboard');
        toast.success(res?.message, { id: toastId });
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (err) {
      toast.error(err as string, { id: toastId });
    }
  };
  return (
    <div className="login-page default-padding-body">
      <Row gutter={[16, 16]} className="login-section-row">
        <Col span={24} className="gutter-row">
          <Card className="login-card">
            <h1 className="login-title">Login Page</h1>
            <Form
              className="login-form"
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item<FieldTypeLogin>
                label="Email"
                name="email"
                className="label-input"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input placeholder="Enter your email" className="input" />
              </Form.Item>

              <Form.Item<FieldTypeLogin>
                label="Password"
                className="label-input"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  className="input"
                />
              </Form.Item>

              <Form.Item label={null}>
                <Button className="login-submit" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
