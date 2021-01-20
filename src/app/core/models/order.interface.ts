export interface Order{
    Id: string;
    CompanyId: string;
    CreateDate: string;
    FinalizedDate: string;
    OrderStatus: string;
    Value: number;
    DiscountPrc: number;
    Discount: number;
    TotalValue: number;
    Currency: string;
    Company: string;
    OrderItems: []
  }