import React from 'react';
import { AppContext } from '../../context/generalContext';
import { MySQLService } from '../../services/MySQLService';

// Redux
import { useAppDispatch } from '../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectCustomerByID, selectCustomerID, selectCustomers } from '../../redux/customers/selectors';
import { selectProjects } from '../../redux/projects/selectors';
import { selectUser } from '../../redux/users/selectors';
import { deleteCustomer, setSelectedCustomerID } from '../../redux/customers/slice';
import { ICustomer } from '@/redux/customers/types';

// Components
import { AddCustomer } from '../../components/popups/addCustomer';
import { CustomerCard } from './customerCard';
import { Overlay } from '../../components/overlay';

import './customers.scss'


export const Customers = () => {
    const service = new MySQLService();
    const dispatch = useAppDispatch();
    const customers = useSelector(selectCustomers)
    const projects = useSelector(selectProjects);
    const selectedCustomerID = useSelector(selectCustomerID)
    const user = useSelector(selectUser);
    const selectedCustomer = useSelector(selectCustomerByID(selectedCustomerID!));
    const {popups} = React.useContext(AppContext);

    const [isEditable, setIsEditable] = React.useState(false);
    const [updatedCustomer, setUpdatedCustomer] = React.useState<ICustomer>({
        customerID: selectedCustomer?.customerID!,
        customerName: selectedCustomer?.customerName!,
        customerEmail: selectedCustomer?.customerEmail!,
        customerAddress: selectedCustomer?.customerAddress
    })

    React.useEffect(() => {
        setUpdatedCustomer({...selectedCustomer!})
    }, [selectedCustomer])
    
    const openCustomerCard = (id: number) => {
        dispatch(setSelectedCustomerID(id));
        popups.setIsCustomerCard(true);
    }

    const deleteCustomerOnClick = async (id: number) => {
        await service.deleteCustomer(id);
        dispatch(deleteCustomer(id))
    }

    const openEditCard = (id: number) => {
        dispatch(setSelectedCustomerID(id));
        setUpdatedCustomer({...selectedCustomer!})
        popups.setIsCustomerCard(true);
        setIsEditable(true);
    }
    const renderCustomers = () => {
        return customers.map((customer) => {
            const assignedProjects = projects.filter((project) => project.customer?.customerName === customer.customerName);
            return (
                <tr className="customers__table-row">
                <td className="customers__table-cell"><span onClick={() => openCustomerCard(customer.customerID!)}>{customer.customerName}</span></td>
                <td className="customers__table-cell">{customer.customerEmail}</td>
                <td className="customers__table-cell">{customer.customerPhone ? customer.customerPhone : "No data"}</td>
                <td className="customers__table-cell">{assignedProjects.length > 0 ? assignedProjects.map((project) => {
                    return (
                        <span>{project.projectName}</span>
                    )
                }) : "No data"}</td>

                {user.userRole?.includes("Owner") || user.userRole?.includes("Executive") ? (
                <td>
                    <div className="customers-table-cell-bts">
                        <button className="button" onClick={() => openEditCard(customer.customerID!)}>Edit</button>
                        <button className="button" onClick={() => deleteCustomerOnClick(customer.customerID!)}>Delete</button>
                    </div>
                </td>) : null}
                
            </tr>
            )
            
        })
    }

    return (
        <div className="customers__container">
            <div className="customers__table-wrapper">
            <table className="customers__customers-table">
                <thead>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Projects</th>
                    {user.userRole?.includes("Owner") || user.userRole?.includes("Executive") ? <th>Settings</th> : null}
                </thead>
                <tbody>
                    {renderCustomers()}
                </tbody>
            </table>
            {customers.length <= 0 ? <div className="no-data">No customers found.</div> : null}
            </div>
        <CustomerCard
        customerID={selectedCustomer?.customerID!}
        customerName={selectedCustomer?.customerName!} 
        customerEmail={selectedCustomer?.customerEmail!}
        customerPhone={selectedCustomer?.customerPhone!}
        customerAddress={selectedCustomer?.customerAddress}
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        setUpdatedCustomer={setUpdatedCustomer}
        updatedCustomer={updatedCustomer} />
        <AddCustomer />
        <Overlay />
        </div>
    )
}