import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class StandardTableOne extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const { data: { list, pagination }, loading, columns, rowKey } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTableOne;
