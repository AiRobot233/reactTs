import {Button, message, Modal, Table, Tag, TreeSelect} from "antd";
import {
    ReloadOutlined,
} from '@ant-design/icons';
import '@/assets/css/common.css';
import React, {useEffect, useState} from "react";
import {request} from "@/request/request";
import UserModal from "@/components/user/UserModal.tsx";
import {Input} from 'antd';

const {Search} = Input;
export default function User() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('新增');
    const [params, setParams] = useState({});
    const [treeData, setTreeData] = useState([]);
    const [searchData] = useState({
        role_id: undefined, keyword: undefined
    });
    const [paginationParams, setPaginationParams] = useState({
        total: 0, current: 1, pageSize: 10
    });


    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
        },
        {
            title: '角色',
            dataIndex: ['role', 'name'],
            key: 'role.name',
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (value) => (
                <Tag style={{margin: 0}}
                     color={value === 1 ? 'success' : 'error'}> {value === 1 ? '正常' : '禁用'}</Tag>
            ),
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
        //获取下拉数据
        request('/admin/sub', 'post', {'role': ''}).then(res => {
            setTreeData(res.data)
        })

        //获取表格数据
        tableData()
    }

    function tableData() {
        let params = {
            page: paginationParams.current, pageSize: paginationParams.pageSize
        }
        params = {...params, ...searchData} //参数合并

        setLoading(true)
        request('/admin/user', 'get', {params}).then(res => {
            setDataSource(res.data.list)
            //设置分页
            setPaginationParams({
                total: res.data.total,
                current: params.page,
                pageSize: params.pageSize
            })

            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

    //新增
    const add = () => {
        setParams({status: 1})
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
                request('/admin/user/' + record.id, 'delete').then(() => {
                    message.success('删除成功')
                    reload()
                })
            },
        });
    }


    //刷新
    const reload = () => {
        paginationParams.current = 1
        paginationParams.pageSize = 10
        searchData.role_id = undefined
        searchData.keyword = undefined
        tableData()
    }

    //关闭
    const onClose = () => {
        setIsModalVisible(false)
        reload()
    }

    //分页
    const pageChange = (page, pageSize) => {
        //设置分页
        paginationParams.current = page
        paginationParams.pageSize = pageSize
        tableData()
    }

    //搜索
    const onSearch = (e: any) => {
        paginationParams.current = 1
        paginationParams.pageSize = 10
        searchData.keyword = e
        tableData()
    }
    const onChange = (e: any) => {
        paginationParams.current = 1
        paginationParams.pageSize = 10
        searchData.role_id = e
        tableData()
    }

    return (
        <div className="body-div">
            <div className="heard">
                <Button type="primary" onClick={add}>新增</Button>
                <Button type="primary" onClick={reload} icon={<ReloadOutlined/>} style={{marginLeft: '10px'}}/>

                <div className="search">
                    <TreeSelect
                        value={searchData.role_id}
                        style={{width: '180px', marginRight: '10px'}}
                        treeNodeFilterProp="name"
                        showSearch
                        placeholder="请选择上级"
                        allowClear
                        treeDefaultExpandAll
                        treeData={treeData}
                        fieldNames={{children: 'children', label: 'name', key: 'id', value: 'id'}}
                        onChange={onChange}
                    />
                    <Search placeholder="名称/电话搜索" onSearch={onSearch} enterButton
                            style={{width: '250px'}} value={searchData.keyword}/>
                </div>

            </div>
            <div className="content-div">
                <Table rowKey="id"
                       columns={columns}
                       dataSource={dataSource}
                       loading={loading}
                       pagination={{
                           current: paginationParams.current,
                           pageSize: paginationParams.pageSize,
                           onChange: pageChange,
                           total: paginationParams.total,
                           showSizeChanger: true,
                           showTotal: (total) => {
                               return `共 ${total} 条`
                           }
                       } as (any)}/>
            </div>

            {isModalVisible &&
                <UserModal params={params} title={title} visible={isModalVisible}
                           onClose={() => onClose()}/>}

        </div>
    )
}
