import { Table, type TableProps } from 'antd';
import type { ColumnType } from 'antd/es/table';

interface BaseTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnType<T>[];
  dataSource: T[];
  pagination?: TableProps<T>['pagination'];
}

export const BaseTable = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  pagination,
  ...props
}: BaseTableProps<T>) => {
  return (
    <Table<T>
      columns={columns}
      dataSource={dataSource}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        ...pagination,
      }}
      rowKey="id"
      scroll={{ x: 'max-content', y: 600 }}
      bordered
      {...props}
    />
  );
};