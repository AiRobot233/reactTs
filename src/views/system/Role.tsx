import {Button, message, Modal, Table} from "antd";
import {
    ReloadOutlined,
} from '@ant-design/icons';
import '@/assets/css/common.css';
import {useEffect, useState} from "react";
import {request} from "@/request/request";
import RoleModal from "@/components/role/RoleModal.tsx";

export default function Role() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('新增');
    const [params, setParams] = useState({});


    const columns: any = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <>
                    <Button onClick={() => edit(record)} disabled={record.id === 1} type="link"
                            size="small">修改</Button>
                    <Button onClick={() => del(record)} disabled={record.id === 1} type="link"
                            size="small">删除</Button>
                </>
            ),
        },
    ]

    useEffect(() => {
        getData()
    }, [])

    function getData() {
        setLoading(true)
        request('/admin/role', 'get').then(res => {
            setDataSource(res.data)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

    //新增
    const add = () => {
        setParams({})
        setTitle('新增')
        setIsModalVisible(true)
    }

    //修改
    const edit = (record: any) => {
        setParams(record)
        setTitle('修改')
        setIsModalVisible(true)
    }

    //删除
    const del = (record: any) => {
        Modal.confirm({
            title: '确认删除该条信息吗？',
            onOk() {
                request('/admin/role/' + record.id, 'delete').then(() => {
                    message.success('删除成功')
                    reload()
                })
            },
        });
    }

    //刷新
    const reload = () => {
        getData()
    }

    //关闭
    const onClose = () => {
        setIsModalVisible(false)
        reload()
    }
    return (
        <div className="body-div">
            <div className="heard">
                <Button type="primary" onClick={add}>新增</Button>
                <Button type="primary" onClick={reload} icon={<ReloadOutlined/>} style={{marginLeft: '10px'}}/>
            </div>
            <div className="content-div">
                <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading}
                       defaultExpandedRowKeys={[1]}/>
            </div>

            {isModalVisible &&
                <RoleModal params={params} title={title} visible={isModalVisible}
                           onClose={() => onClose()}/>}

        </div>
    )
}
