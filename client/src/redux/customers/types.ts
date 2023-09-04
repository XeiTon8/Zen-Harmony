export interface ICustomer {
    customerID: number | null;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | number | null;
    customerAddress?: {
        customerAddress_country?: string;
        customerAddress_state?: string;
        customerAddress_city?: string;
        customerAddress_street?: string;
        customerAddress__zipCode?: number | null;
    }

}

export interface customersState {
    customersList: ICustomer[];
    customer: ICustomer;
    selectedCustomerID: number | null;
}