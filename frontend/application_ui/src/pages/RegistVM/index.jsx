import { useLocation, useParams } from 'react-router-dom'
import './styles.css'
import {  useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { callCreateVM } from '../../apis/callers'

const RegistVM = () => {
    const {templateid} = useParams()
    const [registData, setRegistData] = useState({
        vm_name: '',
        date_release: new Date(),
        date_end: new Date()
    })

    const {state} = useLocation()
    const [amount , setAmount] = useState('')
    const setData = (key, value)  => {
        setRegistData(current => {
            return {
                ...current,
                [key]: value
            }
        })
    }
    const onCreateVM = async () => {
        const result = await callCreateVM({
            ...registData,
            template_id: templateid
        })
        if (result['data']) {
            alert("Tạo máy ảo thành công")
        }
        else {
            alert(result['message'])
        }
    }

    useEffect(() => {
        const days = registData['date_end'].getDate() - registData['date_release'].getDate() + 1
        setAmount((days * 20000).toLocaleString())
    }, [registData])

    return <div className="container hover-shadow rounded-4 border p-5">
        <div className='row'>
            <div className='col-md-6'>
            <h6>Thông tin máy ảo</h6>
                <div className='mt-2'>
                    <p>CPU: <span>{state['cpu']} vCPU</span></p>
                </div>
                <div className='mt-2'>
                    <p>RAM: <span>{state['memory_mb']}</span></p>
                </div>
                <div className='mt-2'>
                    <p>DISK: <span>{state['disk_size_gb']}</span></p>
                </div>
                <div className='mt-2'>
                    <p>OS: <span>{state['os_type']}</span></p>
                </div>
                <div className='mt-2'>
                <p>Node: <span>{state['node']}</span></p>
                </div>
            </div>
            <div className='col-md-6'>
                <h6>Thông tin sử dụng</h6>
                <div className='mt-3 form-group'>
                    <label htmlFor='name'>Tên máy ảo:</label>
                    <input id='name' name='name' value={registData['vm_name']} onChange={(e) => setData('vm_name', e.target.value) } className='form-control ms-2'/>
                </div>
                <div className='mt-3 form-group'>
                    <label htmlFor='date_release'>Ngày bắt đầu:</label>
                    <DatePicker className='form-control ms-2' id='date_release' name='date_release' dateFormat={'YYYY-MM-dd'} onChange={date => setData('date_release', date)} selected={registData['date_release']}/>
                </div>
                <div className='mt-3 form-group'>
                <label htmlFor='date_end'>Ngày kết thúc:</label>
                <DatePicker className='form-control ms-2' id='date_end' name='date_end' dateFormat={'YYYY-MM-dd'} onChange={date => setData('date_end', date)} selected={registData['date_end']}/>
                </div>
                <div className='mt-3 form-group'>
                    <p>Giá thuê: <span>20,000 VNĐ / Ngày</span></p>
                </div>
                <div className='mt-3 form-group'>
                    <p>Đơn giá: <span>{amount} VNĐ</span></p>
                </div>
                <div className='mt-3 form-group'>
                    <button onClick={onCreateVM} className='btn btn-primary'>Tạo</button>
                </div>
            </div>
        </div>
    </div>
}

export default RegistVM