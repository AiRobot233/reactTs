import {useState, useEffect} from 'react';
import {Form, Input, message, Modal, Select, TreeSelect} from 'antd';
import {request} from "@/request/request";


type FieldType = {
    pid?: number;
    name?: string;
    type?: string;
    router?: string;
    method?: string;
    tag?: string;
};

const RuleModal = ({title = '新增', params, visible, onClose}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [form] = Form.useForm();
    const type = Form.useWatch('type', form);


    useEffect(() => {
        setIsModalOpen(visible);
    }, [visible]);

    useEffect(() => {
        getData()
    }, []);

    function getData() {
        //获取下拉数据
        request('/admin/sub', 'post', {'rule': 'page'}).then(res => {
            setTreeData(res.data)
        })
    }

    const handleOk = (values: FieldType) => {
        setConfirmLoading(true)
        //判断添加或者修改
        let url = '/admin/rule';
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
                        treeDefaultExpandAll
                        treeData={treeData}
                        fieldNames={{children: 'children', label: 'name', value: 'id'}}
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
                    label="类型"
                    name="type"
                    rules={[{required: true, message: '请选择类型'}]}
                >
                    <Select
                        placeholder="请选择类型"
                        options={[
                            {value: 'page', label: 'page'},
                            {value: 'api', label: 'api'},
                        ]}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="路由"
                    name="router"
                    rules={[{required: true, message: '请输入地址/路由'}]}
                >
                    <Input placeholder="请输入地址/路由"/>
                </Form.Item>

                {type === 'api' && <Form.Item<FieldType>
                    label="路由规则"
                    name="method"
                    rules={[{required: false}]}
                >
                    <Select
                        placeholder="请选择路由规则"
                        options={[
                            {value: 'GET', label: 'GET'},
                            {value: 'POST', label: 'POST'},
                            {value: 'PUT', label: 'PUT'},
                            {value: 'DELETE', label: 'DELETE'},
                        ]}
                    />
                </Form.Item>}

                {type === 'api' && <Form.Item<FieldType>
                    label="按钮权限"
                    name="tag"
                    rules={[{required: false}]}
                >
                    <Input placeholder="请输入按钮权限"/>
                </Form.Item>}

            </Modal>
        </>
    );
};

export default RuleModal;
