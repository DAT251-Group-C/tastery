import { useQuery } from '@tanstack/vue-query';
import { client } from '@/services/api-client';
import axios from 'axios';
import { RequestParams } from '@/services/api/http-client';

export interface Product {
  name: string;
  image: string;
  current_price: number;
  weight: number;
  store: string;
}

const kassalappControllerSearchWrapper = async (ingredient: string, params: RequestParams = {}): Promise<Product[]> => {
  try {
    const response = await client.kassalappControllerSearch(ingredient, params);
    if (!response.data) {
      throw new Error('No data in response');
    }
    return response.data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Optionally re-throw the error or handle it by returning a default value
    throw error;
  }
}

function useProductsForIngredient(ingredientName: string) {
  const queryInfo = useQuery<Product[]>({
      queryKey: ['products', ingredientName],
      queryFn: () => kassalappControllerSearchWrapper(ingredientName),
      select: data => data.map(product => ({
          name: product.name,
          image: product.image,
          current_price: product.current_price,
          weight: product.weight,
          store: product.store.name
      }))
    });

  if (queryInfo.error) {
    // Handle the error here
    console.error(queryInfo.error);
  }

  return queryInfo;
}

export { useProductsForIngredient }