export interface Customer {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
}

export interface CustomersResponse extends Array<Customer> {}