import { Modal, Form, Input, Select, Switch, InputNumber, type FormItemProps } from 'antd';
import type { Rule } from 'antd/es/form';

interface ModalFormProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk: (values: Record<string, unknown>) => void;
  fields: Array<{
    name: string;
    type: 'input' | 'password' | 'select' | 'textarea' | 'number' | 'switch';
    label: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
    formItemProps?: FormItemProps;
    rules?: Rule[];
  }>;
  initialValues?: Record<string, unknown>;
  width?: string | number;
}

export const ModalForm = ({
  visible,
  title,
  onCancel,
  onOk,
  fields,
  initialValues,
  width = 520,
}: ModalFormProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      width={width}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
            valuePropName={field.type === 'switch' ? 'checked' : undefined}
            {...field.formItemProps}
          >
            {field.type === 'input' && <Input placeholder={field.placeholder} />}
            {field.type === 'password' && <Input.Password placeholder={field.placeholder} />}
            {field.type === 'select' && <Select placeholder={field.placeholder} options={field.options} />}
            {field.type === 'textarea' && <Input.TextArea placeholder={field.placeholder} />}
            {field.type === 'number' && <InputNumber placeholder={field.placeholder} />}
            {field.type === 'switch' && <Switch />}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};