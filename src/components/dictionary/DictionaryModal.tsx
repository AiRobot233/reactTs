import React, {useState, useEffect} from 'react';
import {Form, Input, InputNumber, message, Modal, TreeSelect} from 'antd';
import {request} from "@/request/request";
import {FormInstance} from "rc-field-form/lib/interface";


type FieldType = {
    pid?: number;
    name?: string;
    value?: string;
    sort?: number;
};

const DictionaryModal = ({title = '新增', params, visible, onClose}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);

    const [form] = Form.useForm() as (FormInstance);


    useEffect(() => {
        setIsModalOpen(visible);
    }, [visible]);

    useEffect(() => {
        getData()
    }, []);

    function getData() {
        //获取下拉数据
        request('/admin/sub', 'post', {'dictionary': ''}).then(res => {
            setTreeData([{id: 0, value: '顶级', children: res.data}])
        })

    }

    const handleOk = (values: FieldType) => {
        setConfirmLoading(true)
        //判断添加或者修改
        let url = '/admin/dictionary';
        let method = 'post';
        if (params?.id) {
            url = url + '/' + params?.id;
            method = 'put'
        }
        request(url, method, values).then(() => {
            message.success('操作成功')
            if (onClose) {
                onClose();
            }
            setConfirmLoading(false)
        }).catch(() => {
            setConfirmLoading(false)
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            <Modal title={title} open={isModalOpen} onCancel={handleCancel} confirmLoading={confirmLoading}
                   okButtonProps={{autoFocus: true, htmlType: 'submit'}}
                   modalRender={(dom) => (
                       <Form
                           form={form}
                           name="basic"
                           initialValues={params}
                           labelCol={{span: 5}}
                           wrapperCol={{span: 16}}
                           onFinish={(values) => handleOk(values)}
                       >
                           {dom}
                       </Form>
                   )}>

                <Form.Item<FieldType>
                    label="上级"
                    name="pid"
                    rules={[{required: true, message: '请选择上级'}]}
                >
                    <TreeSelect
                        treeNodeFilterProp="name"
                        showSearch
                        placeholder="请选择上级"
                        allowClear
                        treeData={treeData}
                        fieldNames={{children: 'children', label: 'value', key: 'id', value: 'id'}}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="名称"
                    name="name"
                    rules={[{required: true, message: '请输入名称'}]}
                >
                    <Input placeholder="请输入名称"/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="值"
                    name="value"
                    rules={[{required: true, message: '请输入值'}]}
                >
                    <Input placeholder="请输入值"/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="排序值"
                    name="sort"
                    rules={[{required: true, message: '请输入排序值'}]}
                >
                    <InputNumber placeholder="请输入排序值" min={0} max={255}/>
                </Form.Item>

            </Modal>
        </>
    );
};

export default DictionaryModal;
