import { useContext, useEffect, useState } from 'react'
import './styles.css'
import { callGetUserVM, callgetVMIp, callStartVM, callStopVM } from '../../apis/callers'
import UserContext from '../../context/user'
const VMList = () => {
    const [vms, setVms] = useState([])
    const {user} = useContext(UserContext)
    const [ipList, setIpList] = useState([])
    const [showVMIpId, setShowVMIpId] = useState(null)

    const fetchUserVms = async () => {
        const result = await callGetUserVM(user['id'])

        setVms(result['data'])
    }

    const renderActionButton = (id, index, status) => {
        switch(status) {
            case "ACTIVE": {
                return <button onClick={() => onStartVM(id, index)} className='btn btn-primary'>Chạy</button>
            }
            case "EXPIRED": {
                return <button  className='btn btn-secondary' disabled={true}>Chạy</button>
            }
            case "RUNNING": {
                return <div>
                    <button onClick={() => onGetVMIp(id, index)} className='btn btn-success mx-1'>Lấy IP</button>
                    <button onClick={() => onStopVM(id, index)} className='btn btn-danger mx-1'>Tắt</button>
                </div>
            }
        }
    }
    
    const onStartVM = async (id, index) => {
        const result = await callStartVM(id)
        if (result['data']['status'] === true) {
            alert("Khởi động máy ảo thành công")
            setVms((current) => {
                return current.map((v, i) => {
                    if (i === index) {
                        v['status'] =  "RUNNING"
                    }
                    return v
                })
            })
        }
    }

    const onStopVM = async (id, index) => {
        const result = await callStopVM(id)
        if (result['data']['status'] === true) {
            alert("Tắt máy ảo thành công")
            setVms((current) => {
                return current.map((v, i) => {
                    if (i === index) {
                        v['status'] =  "ACTIVE"
                    }
                    return v
                })
            })
            setIpList([])
            setShowVMIpId(null)
        }
    }

    const onGetVMIp = async (id) => {
        const result = await callgetVMIp(id)
        if (result['data']['status'] === true) {
            setIpList(result['data']['ip']['ip-addresses'])
            setShowVMIpId(id)
        }
        else {
            alert(result['data']['message'])
        }
    }

    useEffect(() =>{
        fetchUserVms()
    }, [])
    return (<div className='container'>
        <table className='table'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Mã số</th>
                    <th>Tên máy ảo</th>
                    <th>Trạng thái</th>
                    <th>Ngày khởi tạo</th>
                    <th>Ngày hết hạn</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {vms.map((vm, index) => {
                    return (<tr key={index}>
                        <td>{index + 1}</td>
                        <td>{vm['id']}</td>
                        <td>{vm['name']}</td>
                        <td>{vm['status']}</td>
                        <td>{vm['date_release']}</td>
                        <td>{vm['date_end']}</td>
                        <td>{renderActionButton(vm['id'], index,  vm['status'])}</td>
                    </tr>)
                })}
            </tbody>
        </table>
        <div>
            {ipList.length > 0 && (
                <>
                    <h5 className='mt-5'>Địa chỉ IP - Mã máy ảo: {showVMIpId}</h5>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Loại</th>
                                <th>Địa chỉ</th>
                                <th>Prefix</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ipList.map((ip, index) => {
                                    return (<tr key={index}>
                                        <td>{ip['ip-address-type']}</td>
                                        <td>{ip['ip-address']}</td>
                                        <td>{ip['prefix']}</td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </table>
                </>
            )}
        </div>
    </div>)
}

export default VMList