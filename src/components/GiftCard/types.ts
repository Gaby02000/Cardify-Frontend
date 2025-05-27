// giftcard/types.ts
export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GiftCard {
  id: number;
  id_category: number;
  title: string;
  description: string;
  amount: string;
  price: number;
  image: string;
  stock: number;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface GiftcardPagination {
  current_page: number;
  data: GiftCard[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
