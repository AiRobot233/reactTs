import React, {useState, useEffect} from 'react';
import {Form, Input, message, Modal, Radio, TreeSelect} from 'antd';
import {request} from "@/request/request";
import {FormInstance} from "rc-field-form/lib/interface";


type FieldType = {
    name?: string;
    phone?: string;
    role_id?: string;
    status?: number;
};

const UserModal = ({title = '新增', params, visible, onClose}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [roleData, setRoleData] = useState([]);

    const [form] = Form.useForm() as (FormInstance);


    useEffect(() => {
        setIsModalOpen(visible);
    }, [visible]);

    useEffect(() => {
        getData()
    }, []);

    function getData() {
        //获取下拉数据
        request('/admin/sub', 'post', {'role': ''}).then(res => {
            setRoleData(res.data)
        })
    }

    const handleOk = (values: FieldType) => {
        setConfirmLoading(true)
        //判断添加或者修改
        let url = '/admin/user';
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
                    label="名称"
                    name="name"
                    rules={[{required: true, message: '请输入名称'}]}
                >
                    <Input placeholder="请输入名称"/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="电话"
                    name="phone"
                    rules={[{required: true, message: '请输入电话'}]}
                >
                    <Input placeholder="请输入电话"/>
                </Form.Item>


                <Form.Item<FieldType>
                    label="角色组"
                    name="role_id"
                    rules={[{required: true, message: '请选择角色组'}]}
                >
                    <TreeSelect
                        treeNodeFilterProp="name"
                        showSearch
                        placeholder="请选择角色组"
                        allowClear
                        treeDefaultExpandAll
                        treeData={roleData}
                        fieldNames={{children: 'children', label: 'name', key: 'id', value: 'id'}}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="状态"
                    name="status"
                    rules={[{required: true, message: '请选择状态'}]}
                >
                    <Radio.Group>
                        <Radio value={1}>正常</Radio>
                        <Radio value={2}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>


            </Modal>
        </>
    );
};

export default UserModal;
