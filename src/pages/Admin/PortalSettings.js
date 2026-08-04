import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../api/apiConfig';
import axios from 'axios';
import { Table } from 'reactstrap';
import { BiEditAlt } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PortalSettings = () => {
    const [settings, setSettings] = useState([])
    const [view, setView] = useState('table')
    const [selectedSetting, setSelectedSetting] = useState(null)
    const [settingValue, setSettingValue] = useState(false)
    const [newSetting, setNewSetting] = useState({ setting_name: '', setting_value: false })
    const [loading, setLoading] = useState(false)

    const getPortalSettings = async () => {
        try {
            const response = await axios.post(`${baseUrl}/admin/getPortalSettings`, { limit: 500, offset: 0 })
            if (response.data.success) {
                setSettings(response.data.data.portalSettings)
            }
        } catch (error) {
            console.log('Failed to fetch portal settings', error)
        }
    }

    useEffect(() => {
        getPortalSettings()
    }, [])

    const handleEdit = (setting) => {
        setSelectedSetting(setting)
        setSettingValue(!!setting.setting_value)
        setView('edit')
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${baseUrl}/admin/editPortalSetting`, {
                id: selectedSetting.id,
                setting_value: settingValue,
            })
            if (response.data.success) {
                toast.success('Setting updated.', { position: 'top-center', theme: 'light' })
                await getPortalSettings()
                setView('table')
            } else {
                toast.error(response.data.message, { position: 'top-center', theme: 'light' })
            }
        } catch (error) {
            console.log('Failed to update portal setting', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSetting = async () => {
        if (!newSetting.setting_name.trim()) {
            toast.error('Setting name is required.', { position: 'top-center', theme: 'light' })
            return
        }
        setLoading(true)
        try {
            const response = await axios.post(`${baseUrl}/admin/addPortalSetting`, newSetting)
            if (response.data.success) {
                toast.success('Setting added.', { position: 'top-center', theme: 'light' })
                setNewSetting({ setting_name: '', setting_value: false })
                await getPortalSettings()
                setView('table')
            } else {
                toast.error(response.data.message, { position: 'top-center', theme: 'light' })
            }
        } catch (error) {
            console.log('Failed to add portal setting', error)
        } finally {
            setLoading(false)
        }
    }

    if (view === 'edit' && selectedSetting) {
        return (
            <div style={{ padding: '20px' }}>
                <ToastContainer />
                <button className='btn-small' style={{ marginBottom: '16px' }} onClick={() => setView('table')}>
                    &larr; Back
                </button>
                <div style={{
                    maxWidth: '400px',
                    boxShadow: '0px 0px 10px 0px #888888',
                    padding: '24px',
                    borderRadius: '6px',
                }}>
                    <h6 style={{ marginBottom: '16px' }}>
                        Edit Setting <strong>{selectedSetting.setting_name}</strong>
                    </h6>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
                        <input
                            type='checkbox'
                            id='setting_value'
                            checked={settingValue}
                            onChange={(e) => setSettingValue(e.target.checked)}
                        />
                        <label htmlFor='setting_value' style={{ margin: 0 }}>Enabled</label>
                    </div>
                    <button className='btn-small' onClick={handleUpdate} disabled={loading} style={{ marginTop: '8px' }}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        )
    }

    if (view === 'add') {
        return (
            <div style={{ padding: '20px' }}>
                <ToastContainer />
                <button className='btn-small' style={{ marginBottom: '16px' }} onClick={() => setView('table')}>
                    &larr; Back
                </button>
                <div style={{
                    maxWidth: '400px',
                    boxShadow: '0px 0px 10px 0px #888888',
                    padding: '24px',
                    borderRadius: '6px',
                }}>
                    <h6 style={{ marginBottom: '16px' }}>Add New Setting</h6>
                    <label htmlFor='setting_name'>Setting Name:</label>
                    <input
                        type='text'
                        id='setting_name'
                        placeholder='Enter setting name'
                        value={newSetting.setting_name}
                        onChange={(e) => setNewSetting({ ...newSetting, setting_name: e.target.value })}
                        style={{ display: 'block', width: '100%', marginBottom: '14px', padding: '6px' }}
                        autoComplete='nope'
                    />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
                        <input
                            type='checkbox'
                            id='new_setting_value'
                            checked={newSetting.setting_value}
                            onChange={(e) => setNewSetting({ ...newSetting, setting_value: e.target.checked })}
                        />
                        <label htmlFor='new_setting_value' style={{ margin: 0 }}>Enabled</label>
                    </div>
                    <button className='btn-small' onClick={handleAddSetting} disabled={loading} style={{ marginTop: '8px' }}>
                        {loading ? 'Saving...' : 'Add Setting'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: '10px' }}>
            <ToastContainer />
            <section style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className='btn-small' onClick={() => setView('add')}>+ Add New Setting</button>
            </section>
            <section style={{ marginTop: '10px' }}>
                <Table responsive>
                    <thead>
                        <tr style={{ fontSize: '12px', borderBottom: '1px solid black' }}>
                            <th>EDIT</th>
                            <th>ID</th>
                            <th>SETTING NAME</th>
                            <th>VALUE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settings.map((setting) => (
                            <tr key={setting.id} style={{ borderBottom: '1px solid lightgrey' }}>
                                <td>
                                    <BiEditAlt
                                        onClick={() => handleEdit(setting)}
                                        style={{ fontSize: '18px', cursor: 'pointer' }}
                                    />
                                </td>
                                <td>{setting.id}</td>
                                <td>{setting.setting_name}</td>
                                <td>{setting.setting_value ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>
        </div>
    )
}

export default PortalSettings
