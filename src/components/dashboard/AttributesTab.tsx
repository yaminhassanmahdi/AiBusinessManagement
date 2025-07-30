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
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Settings, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Attribute {
  id: string;
  name: string;
  type: string;
  is_required: boolean;
  is_filterable: boolean;
  is_searchable: boolean;
  options?: string[];
  sort_order: number;
  is_active: boolean;
}

const AttributesTab = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    is_required: false,
    is_filterable: true,
    is_searchable: true,
    options: '',
    sort_order: '0'
  });

  useEffect(() => {
    if (business?.id) {
      fetchAttributes();
    }
  }, [business]);

  const fetchAttributes = async () => {
    if (!business?.id) return;

    try {
      const { data, error } = await supabase
        .from('product_attributes')
        .select('*')
        .eq('business_id', business.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setAttributes(data || []);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attributes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id) return;

    try {
      const attributeData = {
        business_id: business.id,
        name: formData.name,
        type: formData.type,
        is_required: formData.is_required,
        is_filterable: formData.is_filterable,
        is_searchable: formData.is_searchable,
        options: formData.type === 'select' && formData.options ? 
          formData.options.split(',').map(opt => opt.trim()) : null,
        sort_order: parseInt(formData.sort_order),
        is_active: true
      };

      let error;
      if (editingAttribute) {
        const { error: updateError } = await supabase
          .from('product_attributes')
          .update(attributeData)
          .eq('id', editingAttribute.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('product_attributes')
          .insert([attributeData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Attribute ${editingAttribute ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingAttribute(null);
      resetForm();
      fetchAttributes();
    } catch (error) {
      console.error('Error saving attribute:', error);
      toast({
        title: "Error",
        description: "Failed to save attribute",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'text',
      is_required: false,
      is_filterable: true,
      is_searchable: true,
      options: '',
      sort_order: '0'
    });
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      type: attribute.type,
      is_required: attribute.is_required,
      is_filterable: attribute.is_filterable,
      is_searchable: attribute.is_searchable,
      options: attribute.options ? attribute.options.join(', ') : '',
      sort_order: attribute.sort_order.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (attributeId: string) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;

    try {
      const { error } = await supabase
        .from('product_attributes')
        .delete()
        .eq('id', attributeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attribute deleted successfully",
      });

      fetchAttributes();
    } catch (error) {
      console.error('Error deleting attribute:', error);
      toast({
        title: "Error",
        description: "Failed to delete attribute",
        variant: "destructive",
      });
    }
  };

  const handleNewAttribute = () => {
    setEditingAttribute(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Text';
      case 'number': return 'Number';
      case 'boolean': return 'Yes/No';
      case 'select': return 'Select';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'default';
      case 'number': return 'secondary';
      case 'boolean': return 'outline';
      case 'select': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return <div>Loading attributes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Attributes</CardTitle>
            <CardDescription>Manage product attributes like size, color, material, etc.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewAttribute}>
                <Plus className="h-4 w-4 mr-2" />
                Add Attribute
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}
                </DialogTitle>
                <DialogDescription>
                  Create a new product attribute to define product characteristics
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Attribute Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Yes/No</SelectItem>
                        <SelectItem value="select">Select (Options)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {formData.type === 'select' && (
                  <div className="space-y-2">
                    <Label htmlFor="options">Options (comma-separated) *</Label>
                    <Textarea
                      id="options"
                      value={formData.options}
                      onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                      placeholder="Red, Blue, Green, Black, White"
                      required={formData.type === 'select'}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter options separated by commas (e.g., "Red, Blue, Green")
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_required"
                      checked={formData.is_required}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                    />
                    <Label htmlFor="is_required">Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_filterable"
                      checked={formData.is_filterable}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_filterable: checked })}
                    />
                    <Label htmlFor="is_filterable">Filterable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_searchable"
                      checked={formData.is_searchable}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_searchable: checked })}
                    />
                    <Label htmlFor="is_searchable">Searchable</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAttribute ? 'Update' : 'Create'} Attribute
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {attributes.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No attributes yet. Add your first attribute to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Settings</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributes.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{attribute.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(attribute.type)}>
                      {getTypeLabel(attribute.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {attribute.options && attribute.options.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {attribute.options.slice(0, 3).map((option, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                        {attribute.options.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{attribute.options.length - 3} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {attribute.is_required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      {attribute.is_filterable && (
                        <Badge variant="secondary" className="text-xs">Filter</Badge>
                      )}
                      {attribute.is_searchable && (
                        <Badge variant="outline" className="text-xs">Search</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{attribute.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(attribute)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(attribute.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AttributesTab; 