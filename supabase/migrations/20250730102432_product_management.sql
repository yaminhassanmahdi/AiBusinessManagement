-- Enhanced Product Management System Migration

-- Create product categories table
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, slug)
);

-- Create product attributes table (e.g., Size, Color, Material)
CREATE TABLE public.product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text', -- text, number, boolean, select
  is_required BOOLEAN DEFAULT false,
  is_filterable BOOLEAN DEFAULT true,
  is_searchable BOOLEAN DEFAULT true,
  options JSONB, -- For select type: ["Red", "Blue", "Green"]
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, name)
);

-- Create product variants table
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku TEXT NOT NULL,
  name TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_alert INTEGER DEFAULT 10,
  weight DECIMAL(8,3), -- in kg
  dimensions JSONB, -- {"length": 10, "width": 5, "height": 2}
  barcode TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, sku)
);

-- Create product variant attributes table (links variants to attribute values)
CREATE TABLE public.product_variant_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
  attribute_id UUID REFERENCES public.product_attributes(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(variant_id, attribute_id)
);

-- Create product images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create product tags table
CREATE TABLE public.product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, name)
);

-- Create product-tag relationships table
CREATE TABLE public.product_tag_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.product_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, tag_id)
);

-- Create related products table
CREATE TABLE public.related_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  related_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT DEFAULT 'related', -- related, upsell, cross_sell
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, related_product_id)
);

-- Update the existing products table to add new fields
ALTER TABLE public.products 
ADD COLUMN category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
ADD COLUMN brand TEXT,
ADD COLUMN weight DECIMAL(8,3),
ADD COLUMN dimensions JSONB,
ADD COLUMN barcode TEXT,
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN seo_url TEXT,
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX idx_product_categories_business_id ON public.product_categories(business_id);
CREATE INDEX idx_product_categories_parent_id ON public.product_categories(parent_id);
CREATE INDEX idx_product_attributes_business_id ON public.product_attributes(business_id);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_variant_attributes_variant_id ON public.product_variant_attributes(variant_id);
CREATE INDEX idx_product_variant_attributes_attribute_id ON public.product_variant_attributes(attribute_id);
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_variant_id ON public.product_images(variant_id);
CREATE INDEX idx_product_tag_relationships_product_id ON public.product_tag_relationships(product_id);
CREATE INDEX idx_product_tag_relationships_tag_id ON public.product_tag_relationships(tag_id);
CREATE INDEX idx_related_products_product_id ON public.related_products(product_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);

-- Enable Row Level Security for new tables
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variant_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tag_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.related_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Business data access" ON public.product_categories
  FOR ALL USING (business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Business data access" ON public.product_attributes
  FOR ALL USING (business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Business data access" ON public.product_variants
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id 
    AND (p.business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin')
  ));

CREATE POLICY "Business data access" ON public.product_variant_attributes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = variant_id 
    AND (p.business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin')
  ));

CREATE POLICY "Business data access" ON public.product_images
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id 
    AND (p.business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin')
  ));

CREATE POLICY "Business data access" ON public.product_tags
  FOR ALL USING (business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Business data access" ON public.product_tag_relationships
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id 
    AND (p.business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin')
  ));

CREATE POLICY "Business data access" ON public.related_products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id 
    AND (p.business_id = public.get_user_business_id(auth.uid()) OR public.get_user_role(auth.uid()) = 'admin')
  ));

-- Add triggers for updated_at
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_attributes_updated_at
  BEFORE UPDATE ON public.product_attributes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get product with all related data
CREATE OR REPLACE FUNCTION public.get_product_with_details(product_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'product', to_jsonb(p.*),
    'category', to_jsonb(pc.*),
    'variants', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'variant', to_jsonb(pv.*),
          'attributes', (
            SELECT jsonb_object_agg(pa.name, pva.value)
            FROM public.product_variant_attributes pva
            JOIN public.product_attributes pa ON pa.id = pva.attribute_id
            WHERE pva.variant_id = pv.id
          ),
          'images', (
            SELECT jsonb_agg(to_jsonb(pi.*))
            FROM public.product_images pi
            WHERE pi.variant_id = pv.id
            ORDER BY pi.sort_order
          )
        )
      )
      FROM public.product_variants pv
      WHERE pv.product_id = p.id AND pv.is_active = true
    ),
    'images', (
      SELECT jsonb_agg(to_jsonb(pi.*))
      FROM public.product_images pi
      WHERE pi.product_id = p.id AND pi.variant_id IS NULL
      ORDER BY pi.sort_order
    ),
    'tags', (
      SELECT jsonb_agg(to_jsonb(pt.*))
      FROM public.product_tag_relationships ptr
      JOIN public.product_tags pt ON pt.id = ptr.tag_id
      WHERE ptr.product_id = p.id
    ),
    'attributes', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'attribute', to_jsonb(pa.*),
          'values', (
            SELECT jsonb_agg(DISTINCT pva.value)
            FROM public.product_variant_attributes pva
            JOIN public.product_variants pv ON pv.id = pva.variant_id
            WHERE pv.product_id = p.id AND pva.attribute_id = pa.id
          )
        )
      )
      FROM public.product_attributes pa
      WHERE pa.business_id = p.business_id AND pa.is_active = true
    )
  ) INTO result
  FROM public.products p
  LEFT JOIN public.product_categories pc ON pc.id = p.category_id
  WHERE p.id = product_uuid;
  
  RETURN result;
END;
$$;

-- Note: Default attributes will be created per business when needed
-- This allows each business to have their own custom attributes