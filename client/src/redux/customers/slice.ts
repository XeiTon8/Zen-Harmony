import { ICustomer, customersState } from "./types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { MySQLService } from "../../services/MySQLService";

interface setCustomerPayload {
  name: string;
  value?: string;
  numValue?: number;
}

const service = new MySQLService();

export const fetchCustomers = createAsyncThunk("Customers / get Customers", async () => {
  try {
    const res = await service.getCustomers();
    return res.data;
  } catch (e: any) {
    throw new Error(e);
  }

})

const initialState: customersState = {
  customersList: [],
  customer: {
    customerID: null,
    customerName: "",
    customerEmail: "",
    customerPhone: null,
    customerAddress: {
      customerAddress_country: "",
      customerAddress_state: "",
      customerAddress_city: "",
      customerAddress_street: "",
      customerAddress__zipCode: null
    },
  },

  selectedCustomerID: null
}

const customersSlice = createSlice({
  name: "Customers",
  initialState,
  reducers: {

    addCustomer(state, action: PayloadAction<ICustomer>) {
      state.customersList.push(action.payload);
    },

    deleteCustomer(state, action: PayloadAction<number>) {
      state.customersList = state.customersList.filter((customer: ICustomer) => customer.customerID !== action.payload);
    },

    updateCustomer(state, action: PayloadAction<ICustomer>) {
      const updatedCustomer = action.payload;
      const customerIndex = state.customersList.findIndex((customer) => customer.customerID === updatedCustomer.customerID);
      if (customerIndex !== -1) {
        state.customersList[customerIndex] = updatedCustomer;
      }
    },

    setSelectedCustomerID(state, action: PayloadAction<number>) {
      state.selectedCustomerID = action.payload;
    },

    setCustomer(state, action: PayloadAction<setCustomerPayload>) {
      const { name, value, numValue } = action.payload;

      switch (name) {
        
        case 'customerAddress_country':
          return {
            ...state,
            customer: {
              ...state.customer,
              customerAddress: {
                ...state.customer.customerAddress,
                customerAddress_country: value,
              },
            },
          };

        case 'customerAddress_city':
          return {
            ...state,
            customer: {
              ...state.customer,
              customerAddress: {
                ...state.customer.customerAddress,
                customerAddress_city: value,
              },
            },
          };

        case 'customerAddress_state':
          return {
            ...state,
            customer: {
              ...state.customer,
              customerAddress: {
                ...state.customer.customerAddress,
                customerAddress_state: value,
              },
            },
          };

        case 'customerAddress__street':
          return {
            ...state,
            customer: {
              ...state.customer,
              customerAddress: {
                ...state.customer.customerAddress,
                customerAddress_street: value,
              },
            },
          };

        case 'customerAddress__zipCode':
          return {
            ...state,
            customer: {
              ...state.customer,
              customerAddress: {
                ...state.customer.customerAddress,
                customerAddress__zipCode: numValue,
              },
            },
          };

        default:
          return {
            ...state,
            customer: {
              ...state.customer,
              [name]: value,
            },
          };
      }
    },

  },
  extraReducers(builder) {
    builder.addCase(fetchCustomers.pending, (state) => {
      state.customersList = [];
    })

    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.customersList = action.payload;
    })

    builder.addCase(fetchCustomers.rejected, (state) => {
      state.customersList = [];
    })
  },
})

export const { addCustomer, deleteCustomer, updateCustomer, setCustomer, setSelectedCustomerID } = customersSlice.actions;

export default customersSlice.reducer;