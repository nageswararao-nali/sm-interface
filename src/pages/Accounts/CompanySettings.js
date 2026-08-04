import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../api/apiConfig';
import axios from 'axios';
import { Table } from 'reactstrap';
import { BiEditAlt } from 'react-icons/bi';
import "../../styles/Accounts/companies.css";
import Pagination from '../../Pagination';

const CompanySettings = () => {
    const [comData, setComData] = useState([])
    const [view, setView] = useState('table')
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [preferences, setPreferences] = useState({
        is_regular: false,
        is_otp_enabled: false,
        is_delivery_proof_enabled: false,
    })
    const [loading, setLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)

    const showDataPerPage = 10
    const pageCount = Math.ceil(comData.length / showDataPerPage)
    const pagesVisited = pageNumber * showDataPerPage

    const handlePageChange = ({ selected }) => {
        setPageNumber(selected)
    }

    const url = `${baseUrl}/users/getAllCompanies`;
    async function getCompaniesData() {
        const response = await axios.post(url, { limit: 500, offset: 0 });
        setComData(response.data.data);
    }

    useEffect(() => {
        getCompaniesData()
    }, []);

    const handleEdit = (company) => {
        setSelectedCompany(company)
        setPreferences({
            is_regular: !!company.is_regular,
            is_otp_enabled: company.is_otp_enabled === 'Yes',
            is_delivery_proof_enabled: company.is_delivery_proof_enabled === 'Yes',
        })
        setView('edit')
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setPreferences(prev => ({ ...prev, [name]: checked }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await axios.post(`${baseUrl}/users/addCustomerCompany`, {
                id: selectedCompany.id,
                is_regular: preferences.is_regular,
                is_otp_enabled: preferences.is_otp_enabled ? 'Yes' : 'No',
                is_delivery_proof_enabled: preferences.is_delivery_proof_enabled ? 'Yes' : 'No',
            })
            await getCompaniesData()
            setView('table')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const formatBool = (val) => val === 'Yes' ? 'Yes' : 'No'
    const formatRegular = (val) => val ? 'Yes' : 'No'

    if (view === 'edit' && selectedCompany) {
        return (
            <div style={{ padding: '20px' }}>
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
                        Settings for <strong>{selectedCompany.company_name}</strong>
                    </h6>
                    {[
                        { name: 'is_regular', label: 'Regular' },
                        { name: 'is_otp_enabled', label: 'OTP Enabled' },
                        { name: 'is_delivery_proof_enabled', label: 'Delivery Proof Enabled' },
                    ].map(({ name, label }) => (
                        <div key={name} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
                            <input
                                type='checkbox'
                                id={name}
                                name={name}
                                checked={preferences[name]}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={name} style={{ margin: 0 }}>{label}</label>
                        </div>
                    ))}
                    <button className='btn-small' onClick={handleSubmit} disabled={loading} style={{ marginTop: '8px' }}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: '10px' }}>
            <section style={{ marginTop: '50px' }}>
                <Table responsive>
                    <thead>
                        <tr style={{ fontSize: '12px', borderBottom: '1px solid black' }}>
                            <th>EDIT</th>
                            <th>ID</th>
                            <th>COMPANY NAME</th>
                            <th>REGULAR</th>
                            <th>OTP ENABLED</th>
                            <th>DELIVERY PROOF ENABLED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comData.slice(pagesVisited, pagesVisited + showDataPerPage).map((company) => (
                            <tr key={company.id} style={{ borderBottom: '1px solid lightgrey' }}>
                                <td>
                                    <BiEditAlt
                                        onClick={() => handleEdit(company)}
                                        style={{ fontSize: '18px', cursor: 'pointer' }}
                                    />
                                </td>
                                <td>{company.id}</td>
                                <td>{company.company_name}</td>
                                <td>{formatRegular(company.is_regular)}</td>
                                <td>{formatBool(company.is_otp_enabled)}</td>
                                <td>{formatBool(company.is_delivery_proof_enabled)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>
            <section id='companiesPagination' style={{ position: 'relative', marginBottom: '30px', marginTop: '10px', padding: '10px' }}>
                <Pagination
                    pageCount={pageCount}
                    handlePageChange={handlePageChange}
                    pageNumber={pageNumber}
                />
            </section>
        </div>
    )
}

export default CompanySettings
