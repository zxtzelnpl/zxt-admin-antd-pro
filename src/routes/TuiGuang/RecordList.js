import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTableOne from 'components/StandardTableOne';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './RecordList.less';

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({records, loading}) => ({
  records,
  loading: loading.models.records,
}))
@Form.create()
export default class RecordList extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'records/total',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {

    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    };

    dispatch({
      type: 'records/page',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'records/total',
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      if(fieldsValue.record_date_from){values.record_date_from = fieldsValue.record_date_from.valueOf()}
      if(fieldsValue.record_date_to){values.record_date_to = fieldsValue.record_date_to.valueOf()}

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'records/total',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="文章标题">
              {getFieldDecorator('record_title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="组别">
              {getFieldDecorator('record_team')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="文章标题">
              {getFieldDecorator('record_title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="组别">
              {getFieldDecorator('record_team')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备">
              {getFieldDecorator('record_device')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="iPhone">iPhone</Option>
                  <Option value="Android">Android</Option>
                  <Option value="unknown">未知</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="起始日期">
              {getFieldDecorator('record_date_from')(
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结束日期">
              {getFieldDecorator('record_date_to')(
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {records: {data}, loading} = this.props;

    const columns = [
      {
        title: '文章标题',
        dataIndex: 'record_title',
      },
      {
        title: '浏览设备',
        dataIndex: 'record_device',
      },
      {
        title: '用户IP',
        dataIndex: 'record_ip',
      },
      {
        title: '组别',
        dataIndex: 'record_team',
      },
      {
        title: '记录时间',
        dataIndex: 'record_date',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTableOne
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
