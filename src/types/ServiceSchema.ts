export type ServiceType = {
  id: number;
  nameEn: string;
  nameAr: string;
  textureEn: string;
  textureAr: string;
  descriptionEn: string;
  descriptionAr: string;
  backgroundImage?: string;
  logoImage?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
};

export type Service = {
  serviceId: string;
  nameEn: string;
  nameAr: string;
  textureEn: string;
  textureAr: string;
  descriptionEn: string;
  descriptionAr: string;
  providerId: string;
  typeId: number;
  createdAt: string; // ISO timestamp
  backgroundImage?: string;
  logoImage?: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  active: boolean;
  commission: number;
  openTime: string;
  closeTime: string;
  commissionType: "FIXED" | "PERCENTAGE";
  country?: string;
  city?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  approved: boolean;
};

export type Product = {
  id: number;
  productId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  serviceId: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  categoryId: number;
  active: boolean;
  backgroundImage: string;
  logoImage: string;
  approvedBy: string;
  approvedAt: string; // ISO date string
  isDeleted: boolean;
  deletedAt: string; // ISO date string
  deletedBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  approved: boolean;
};

export type ProductGrouped = {
  productId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  logoImage: string;
};

export type ProductCategoryMap = {
  [categoryKey: string]: ProductGrouped[];
};
