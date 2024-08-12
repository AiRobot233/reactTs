import {useState, useEffect} from 'react';
import {Form, Input, message, Modal} from 'antd';
import {request} from "@/request/request";


type FieldType = {
    old_password?: string;
    password?: string;
};


const EditPasswordModal = ({visible, onClose}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const oldPasswordValue = Form.useWatch('old_password', form);

    useEffect(() => {
        setIsModalOpen(visible);
    }, [visible]);

    const handleOk = (values: FieldType) => {
        setConfirmLoading(true)
        request('/admin/change/pwd', 'put', values).then(() => {
            setIsModalOpen(false);
            message.success('修改成功')
            if (onClose) {
                onClose();
            }
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

    //新密码校验
    const passValidate = async (_rule: any, value: string) => {
        if (!value) {
            return Promise.reject('请输入新密码');
        }
        if (value === oldPasswordValue) {
            return Promise.reject('新密码不能和旧密码相同');
        }
        return Promise.resolve();
    };

    return (
        <>
            <Modal title="修改密码" open={isModalOpen} onCancel={handleCancel} confirmLoading={confirmLoading}
                   okButtonProps={{autoFocus: true, htmlType: 'submit'}}
                   modalRender={(dom) => (
                       <Form
                           form={form}
                           name="basic"
                           labelCol={{span: 5}}
                           wrapperCol={{span: 16}}
                           onFinish={(values) => handleOk(values)}
                       >
                           {dom}
                       </Form>
                   )}>
                <Form.Item<FieldType>
                    label="旧密码"
                    name="old_password"
                    rules={[{required: true, message: '请输入旧密码'}]}
                >
                    <Input.Password placeholder="请输入旧密码"/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="新密码"
                    name="password"
                    rules={[{required: true, validator: passValidate}]}
                >
                    <Input.Password placeholder="请输入新密码"/>
                </Form.Item>
            </Modal>
        </>
    );
};

export default EditPasswordModal;
