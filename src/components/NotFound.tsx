import {Button, Result} from 'antd';
import {useNavigate} from "react-router-dom";


export default function NotFound() {
    const navigate = useNavigate()
    const backHome = () => {
        navigate('/home')
    }

    return (
        <Result
            status="404"
            title="404"
            subTitle="您访问的页面不存在"
            extra={<Button type="primary" onClick={backHome}>返回首页</Button>}
        />
    );
}

