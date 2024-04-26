export interface Product {
    name: string;
    image: string;
    current_price: number;
    weight: number | null;
}

export interface ProductResponse {
    data: Product[];
    meta: {
        hasNextPage: boolean;
        page: number;
    };
}
