import { RootState } from "../store";

export const selectCustomers = (state: RootState) => state.Customers.customersList;

export const selectCustomerForForm = (state: RootState) => state.Customers.customer;

export const selectCustomerByID = (id: number) => (state: RootState) => state.Customers.customersList.find((customer) => customer.customerID === id)

export const selectCustomerID = (state: RootState) => state.Customers.selectedCustomerID;