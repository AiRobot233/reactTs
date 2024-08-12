import {Button, message, Modal, Table} from "antd";
import {
    ReloadOutlined,
} from '@ant-design/icons';
import '@/assets/css/common.css';
import React, {useEffect, useState} from "react";
import {request} from "@/request/request";
import RuleModal from "@/components/rule/RuleModal.tsx";

export default function Rule() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('新增');
    const [params, setParams] = useState({});


    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
        },
        {
            title: '路由',
            dataIndex: 'router',
            key: 'router',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <>
                    {record.type === 'page' &&
                        <Button onClick={() => addChildren(record)} type="link" size="small">创建子规则</Button>}
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
        request('/admin/rule', 'get').then(res => {
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

    //创建子规则
    const addChildren = (record: any) => {
        setParams({pid: record.id})
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
                request('/admin/rule/' + record.id, 'delete').then(() => {
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
                <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading}/>
            </div>

            {isModalVisible &&
                <RuleModal params={params} title={title} visible={isModalVisible}
                           onClose={() => onClose()}/>}

        </div>
    )
}
