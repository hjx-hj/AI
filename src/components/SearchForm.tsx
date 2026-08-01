import { Form, Input, Select, Button, Space, type FormItemProps } from 'antd';

interface SearchFormProps {
  fields: Array<{
    name: string;
    type: 'input' | 'select';
    label?: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
    formItemProps?: FormItemProps;
  }>;
  onSearch: (values: Record<string, unknown>) => void;
  onReset: () => void;
}

export const SearchForm = ({ fields, onSearch, onReset }: SearchFormProps) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="inline" onFinish={handleSearch}>
      <Space wrap>
        {fields.map((field) => (
          <Form.Item key={field.name} name={field.name} label={field.label} {...field.formItemProps}>
            {field.type === 'input' ? (
              <Input placeholder={field.placeholder} allowClear />
            ) : (
              <Select placeholder={field.placeholder} options={field.options} allowClear />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Space>
    </Form>
  );
};