import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Package, AlertTriangle, Image, Tag, Settings, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Attribute {
  id: string;
  name: string;
  type: string;
  options?: string[];
}

interface ProductVariant {
  id: string;
  sku: string;
  name?: string;
  price: number;
  cost?: number;
  stock_quantity: number;
  low_stock_alert: number;
  weight?: number;
  dimensions?: any;
  barcode?: string;
  is_active: boolean;
  attributes?: { [key: string]: string };
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  sku?: string;
  category_id?: string;
  category?: Category;
  brand?: string;
  weight?: number;
  dimensions?: any;
  barcode?: string;
  meta_title?: string;
  meta_description?: string;
  seo_url?: string;
  is_featured: boolean;
  sort_order: number;
  stock_quantity: number;
  low_stock_alert: number;
  image_url?: string;
  is_active: boolean;
  variants?: ProductVariant[];
  tags?: any[];
}

const ProductsTab = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    sku: '',
    category_id: '',
    brand: '',
    weight: '',
    barcode: '',
    meta_title: '',
    meta_description: '',
    seo_url: '',
    is_featured: false,
    sort_order: '0',
    stock_quantity: '',
    low_stock_alert: '10',
    image_url: ''
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (business?.id) {
      fetchProducts();
      fetchCategories();
      fetchAttributes();
    }
  }, [business]);

  const fetchProducts = async () => {
    if (!business?.id) return;

    try {
      // First, let's try a simple query to see if the table exists
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Products data:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!business?.id) return;

    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAttributes = async () => {
    if (!business?.id) return;

    try {
      const { data, error } = await supabase
        .from('product_attributes')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setAttributes(data || []);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id) return;

    try {
      const productData = {
        business_id: business.id,
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        sku: formData.sku || null,
        category_id: formData.category_id === 'no-category' ? null : formData.category_id || null,
        brand: formData.brand || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        barcode: formData.barcode || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        seo_url: formData.seo_url || null,
        is_featured: formData.is_featured,
        sort_order: parseInt(formData.sort_order),
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_alert: parseInt(formData.low_stock_alert),
        image_url: formData.image_url || null,
        is_active: true
      };

      let productId: string;
      let error;

      if (editingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        error = updateError;
        productId = editingProduct.id;
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from('products')
          .insert([productData])
          .select('id')
          .single();
        error = insertError;
        productId = insertData?.id;
      }

      if (error) throw error;

      // Handle variants if any
      if (variants.length > 0 && productId) {
        for (const variant of variants) {
          const variantData = {
            product_id: productId,
            sku: variant.sku,
            name: variant.name || null,
            price: variant.price,
            cost: variant.cost || null,
            stock_quantity: variant.stock_quantity,
            low_stock_alert: variant.low_stock_alert,
            weight: variant.weight || null,
            dimensions: variant.dimensions || null,
            barcode: variant.barcode || null,
            is_active: true
          };

          const { error: variantError } = await supabase
            .from('product_variants')
            .insert([variantData]);

          if (variantError) {
            console.error('Error saving variant:', variantError);
          }
        }
      }

      // Handle tags if any
      if (selectedTags.length > 0 && productId) {
        for (const tagName of selectedTags) {
          // First, ensure tag exists
          let { data: tagData } = await supabase
            .from('product_tags')
            .select('id')
            .eq('business_id', business.id)
            .eq('name', tagName)
            .single();

          if (!tagData) {
            const { data: newTag } = await supabase
              .from('product_tags')
              .insert([{ business_id: business.id, name: tagName }])
              .select('id')
              .single();
            tagData = newTag;
          }

          if (tagData) {
            await supabase
              .from('product_tag_relationships')
              .insert([{ product_id: productId, tag_id: tagData.id }]);
          }
        }
      }

      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      setVariants([]);
      setSelectedTags([]);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      cost: '',
      sku: '',
      category_id: 'no-category',
      brand: '',
      weight: '',
      barcode: '',
      meta_title: '',
      meta_description: '',
      seo_url: '',
      is_featured: false,
      sort_order: '0',
      stock_quantity: '',
      low_stock_alert: '10',
      image_url: ''
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      cost: product.cost?.toString() || '',
      sku: product.sku || '',
      category_id: product.category_id || 'no-category',
      brand: product.brand || '',
      weight: product.weight?.toString() || '',
      barcode: product.barcode || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      seo_url: product.seo_url || '',
      is_featured: product.is_featured,
      sort_order: product.sort_order.toString(),
      stock_quantity: product.stock_quantity.toString(),
      low_stock_alert: product.low_stock_alert.toString(),
      image_url: product.image_url || ''
    });
    setVariants([]);
    setSelectedTags([]);
    setIsDialogOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your inventory and product catalog</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the product details below
                </DialogDescription>
              </DialogHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Tags</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-category">No Category</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="low_stock_alert">Low Stock Alert</Label>
                      <Input
                        id="low_stock_alert"
                        type="number"
                        value={formData.low_stock_alert}
                        onChange={(e) => setFormData({ ...formData, low_stock_alert: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sort_order">Sort Order</Label>
                      <Input
                        id="sort_order"
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_featured">Featured Product</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4">
                  <div className="text-center py-4">
                    <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Product variants feature coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="SEO description for search engines"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_url">SEO URL</Label>
                    <Input
                      id="seo_url"
                      value={formData.seo_url}
                      onChange={(e) => setFormData({ ...formData, seo_url: e.target.value })}
                      placeholder="product-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => setSelectedTags(selectedTags.filter((_, i) => i !== index))}>
                          {tag} ×
                        </Badge>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newTag = prompt('Enter tag name:');
                          if (newTag && !selectedTags.includes(newTag)) {
                            setSelectedTags([...selectedTags, newTag]);
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Tag
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products yet. Add your first product to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.description && (
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </p>
                      )}

                    </div>
                  </TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell>
                    {product.category_id ? (
                      <Badge variant="outline">Category ID: {product.category_id}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{product.brand || '-'}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.stock_quantity}</span>
                      {product.stock_quantity <= product.low_stock_alert && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={product.stock_quantity > 0 ? 'secondary' : 'destructive'}>
                        {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                      {product.is_featured && (
                        <Badge variant="default" className="text-xs">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsTab;