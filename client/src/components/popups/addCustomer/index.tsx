import React from 'react';
import { AppContext } from '../../../context/generalContext';
import { MySQLService } from '../../../services/MySQLService';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { selectCustomerForForm } from '../../../redux/customers/selectors';
import { addCustomer, setCustomer } from '../../../redux/customers/slice';
import { ICustomer } from '../../../redux/customers/types';

import './addCustomer.scss'

export const AddCustomer = () => {

    const {popups} = React.useContext(AppContext);
    const dispatch = useAppDispatch();
    const service = new MySQLService();
    const customer = useSelector(selectCustomerForForm);
    const [isMoreInfo, setIsMoreInfo] = React.useState(false);

    const handleInput = (e: React.ChangeEvent) => {
        const {name, value} = (e.target) as HTMLInputElement;
        if (name === 'customerAddress__zipCode') {
            dispatch(setCustomer({name, numValue: Number(value)}))
        } else {
            dispatch(setCustomer({name, value}));
        }
    }

    const addNewCustomer = async (e: React.FormEvent, customer: ICustomer) => {
        e.preventDefault();
        try {
            const res = await service.createCustomer(customer);
            const fetchedCustomer = await service.getCustomerByID(res.data.insertId);
            const customerToAdd = fetchedCustomer.data[0];
            console.log(customerToAdd);
            dispatch(addCustomer(customerToAdd))
            popups.setIsAddCustomer(false);
            popups.setIsOverlay(false);
            
        } catch (error: any) {
            throw new Error(error)
        }
    }

    const closeForm = () => {
        popups.setIsAddCustomer(false);
        popups.setIsOverlay(false);
    }

    const addMoreInfo = () => {
        setIsMoreInfo(true);
    }

    const closeMoreInfo = () => {
        setIsMoreInfo(false);
    }

    return (
        <form className={`add-customer-form ${popups.isAddCustomer ? "add-customer-form--active" : "add-customer-form--hidden"}`} onSubmit={(e: React.FormEvent) => addNewCustomer(e, customer)}>
            <div className="add-customer-form__content-wrapper add-customer-content">
                <div className="add-customer-content__main-info">
                    <input type="text"  placeholder='Name' name="customerName"  required  onChange={handleInput} />
                    <input type="text"  placeholder='Email' name="customerEmail" required  onChange={handleInput} />
                    <input type="text" id="" placeholder='Phone number' name="customerPhone" onChange={handleInput}  />
                </div>
                <div className={`add-customer-content__address-info ${isMoreInfo ? "" : "more-info--hidden" }`}>
                    <input type="text"  placeholder='Country' onChange={handleInput}/>
                    <input type="text"  placeholder='State' onChange={handleInput} />
                    <input type="text"  placeholder='City'  onChange={handleInput} />
                    <input type="text"  placeholder='Street' onChange={handleInput} />
                    <input type="number" name="" id=""  placeholder='Zip-code' onChange={handleInput} />
                    <span className="close-more-info" onClick={() => closeMoreInfo()}>Close</span>
                </div>
            </div>
            <span className="add-customer-form__add-more-info" onClick={() => addMoreInfo()}>Add more information</span>
            <button className="button" type="submit">Confirm</button>
            <button type="button" className="button" onClick={() => closeForm()}>Cancel</button>
        </form>
    )
}