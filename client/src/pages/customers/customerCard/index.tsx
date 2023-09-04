import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';

import { useAppDispatch } from '../../../redux/hooks';
import { updateCustomer } from '../../../redux/customers/slice';

import { ICustomer } from '../../../redux/customers/types';

import './customerCard.scss'

interface customerCardProps extends ICustomer {
    isEditable: boolean;
    setIsEditable: (val: boolean) => void;
    setUpdatedCustomer: (val: any) => void;
    updatedCustomer: ICustomer;
}
export const CustomerCard: React.FC<customerCardProps> = ({customerName, customerEmail, customerPhone, customerAddress, customerID, isEditable, setIsEditable, setUpdatedCustomer, updatedCustomer}) => {

    const {popups} = React.useContext(AppContext)
    const service = new MySQLService();
    const dispatch = useAppDispatch();

    const closeCard = () => {
        popups.setIsCustomerCard(false);
        setIsEditable(false);
    }


    const handleUpdatedCustomer = (e: React.ChangeEvent) => {
        const {name, value} = (e.target) as HTMLInputElement;

        setUpdatedCustomer((prev: ICustomer) => ({
            ...prev,
            [name]: value
        }))
        console.log(updatedCustomer);
    }

    const sendUpdateCustomer = async (customer: ICustomer) => {
        await service.updateCustomer(customer.customerID!, customer);
        const fetchedCustomer = await service.getCustomerByID(customer.customerID!);
        const customerToAdd = fetchedCustomer.data[0];
        dispatch(updateCustomer(customerToAdd))
        closeCard()

    }
    return (
        <>
        {isEditable ? (
            <div>
                <form action="" className={` customer-card ${popups.isCustomerCard ? "customer-card--active" : "customer-card--hidden"}`}>
                    <div className="customer-card__main-info">
                        <label htmlFor="customerName">Name</label>
                        <input type="text" value={updatedCustomer.customerName} id="customerName" placeholder='Name' onChange={handleUpdatedCustomer} name="customerName" />
                        <label htmlFor="customerEmail">Email</label>
                        <input type="text" value={updatedCustomer.customerEmail} id="customerEmail" placeholder='Email'  onChange={handleUpdatedCustomer}  name="customerEmail" />
                        <label htmlFor="customerPhone">Phone number</label>
                        <input type="text" value={updatedCustomer.customerPhone!} id="customerPhone" placeholder='Phone number' onChange={handleUpdatedCustomer} />
                    </div>

                    <div className="customer-card__address">
                        <div className="address__main-info">
                            <label htmlFor="customer-address__country">Country</label>
                            <input type="text" value={updatedCustomer.customerAddress?.customerAddress_country} id="customer-address__country" placeholder='Country' onChange={handleUpdatedCustomer} />
                            <label htmlFor="customer-address__state">State</label>
                            <input type="text" value={updatedCustomer.customerAddress?.customerAddress_state} id="customer-address__state" placeholder='State' onChange={handleUpdatedCustomer} />
                            </div>
                            <div className="customer-card__additional-address">
                            <label htmlFor="customer-address__city">City</label>
                            <input type="text" value={updatedCustomer.customerAddress?.customerAddress_city} id="customer-address__city"  placeholder='City' onChange={handleUpdatedCustomer}  />
                            <label htmlFor="customer-address__street">Street</label>
                            <input type="text" value={updatedCustomer.customerAddress?.customerAddress_street} id="customer-address__street" placeholder='Street' onChange={handleUpdatedCustomer} />
                            <label htmlFor="customer-address__zipCode">Zip Code</label>
                            <input type="text" value={updatedCustomer.customerAddress?.customerAddress__zipCode!} id="customer-address__zipCode" placeholder='Zip Code' onChange={handleUpdatedCustomer} />
                        </div>
                    </div>
                    <button className="button" type="button" onClick={() => closeCard()}>Close</button>
                    <button className="button" type="submit" onClick={() => sendUpdateCustomer(updatedCustomer)}>Confirm</button>
                </form>
            
            </div>
        ) : (
            <div>
                <form action=""  className={` customer-card ${popups.isCustomerCard ? "customer-card--active" : "customer-card--hidden"}`}>
                    <div className="customer-card__main-info">
                        <label htmlFor="customerName">Name</label>
                        <input type="text" value={customerName} id="customerName" placeholder='Name' readOnly />
                        <label htmlFor="customerEmail">Email</label>
                        <input type="text" value={customerEmail} id="customerEmail" placeholder='Email' readOnly />
                        <label htmlFor="customerPhone">Phone number</label>
                        <input type="text" value={customerPhone!} id="customerPhone" placeholder='Phone number' readOnly />
                    </div>
            
                    <div className="customer-card__address">
                        <div className="address__main-info">
                            <label htmlFor="customer-address__country">Country</label>
                            <input type="text" value={customerAddress?.customerAddress_country} id="customer-address__country" placeholder='Country' readOnly />
                            <label htmlFor="customer-address__state">State</label>
                            <input type="text" value={customerAddress?.customerAddress_state} id="customer-address__state" placeholder='State' readOnly />
                        </div>
                        <div className="customer-card__additional-address">
                            <label htmlFor="customer-address__city">City</label>
                            <input type="text" value={customerAddress?.customerAddress_city} id="customer-address__city"  placeholder='City' readOnly />
                            <label htmlFor="customer-address__street">Street</label>
                            <input type="text" value={customerAddress?.customerAddress_street} id="customer-address__street" placeholder='Street' readOnly />
                            <label htmlFor="customer-address__zipCode">Zip Code</label>
                            <input type="text" value={customerAddress?.customerAddress__zipCode!} id="customer-address__zipCode" placeholder='Zip Code' readOnly />
                        </div>
                    </div>
                    <button className="button" type="button" onClick={() => closeCard()}>Close</button>
                </form>
            
        </div>

        )}</>
        
        
    )
}