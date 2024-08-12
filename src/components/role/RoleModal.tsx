import React, {useState, useEffect} from 'react';
import {Form, Input, message, Modal, Tree, TreeSelect} from 'antd';
import {request} from "@/request/request";
import {getAllIdsUnderNode, getAllRelatedIds} from "@/utils/ts/utils.ts";
import {FormInstance} from "rc-field-form/lib/interface";


type FieldType = {
    name?: string;
    pid?: number;
    rule?: string;
};

const RoleModal = ({title = '新增', params, visible, onClose}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [ruleData, setRuleData] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState(params?.rule ? params?.rule.split(',').map((element) => parseInt(element)) : []);

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
            setTreeData(res.data)
        })

        //获取下拉数据
        request('/admin/sub', 'post', {'rule': ''}).then(res => {
            setRuleData(res.data)
        })
    }

    const handleOk = (values: FieldType) => {
        setConfirmLoading(true)
        //判断添加或者修改
        let url = '/admin/role';
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

    //手动选中数据
    const check = (checkedKeys: any, e: any) => {
        let data = []
        if (e.checked) {
            //合并数组
            const children = getAllRelatedIds(ruleData, e.node.id)
            data = [...new Set([...checkedKeys.checked, ...children])]
        } else {
            //移除数组
            const children = getAllIdsUnderNode(ruleData, e.node.id)
            data = checkedKeys.checked.filter((item: any) => !children.includes(item))
        }
        setCheckedKeys(data)
        form.setFieldsValue({rule: data.join(',')});
    }

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
                    label="上级"
                    name="pid"
                    rules={[{required: true, message: '请选择上级'}]}
                >
                    <TreeSelect
                        treeNodeFilterProp="name"
                        showSearch
                        placeholder="请选择上级"
                        allowClear
                        treeDefaultExpandAll
                        treeData={treeData}
                        fieldNames={{children: 'children', label: 'name', key: 'id', value: 'id'}}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="规则"
                    name="rule"
                    rules={[{required: true, message: '请选择规则'}]}
                >
                    <Tree
                        checkable={true}
                        checkStrictly={true}
                        treeData={ruleData}
                        checkedKeys={checkedKeys as (any[])}
                        fieldNames={{children: 'children', title: 'name', key: 'id'}}
                        onCheck={check}
                    />
                </Form.Item>

            </Modal>
        </>
    );
};

export default RoleModal;
