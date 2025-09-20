import express from 'express';
import { supabase } from '../utils/supabase';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('inventory_categories')
      .select('*')
      .order('name');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/items', async (req, res) => {
  try {
    const { status, category_id } = req.query;
    let query = supabase
      .from('inventory_items')
      .select(`
        *,
        category:category_id(name)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data: items, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(items);
  } catch (error) {
    console.error('Get inventory items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabase
      .from('inventory_items')
      .select(`
        *,
        category:category_id(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/items', async (req, res) => {
  try {
    const itemData = req.body;

    const { data: item, error } = await supabase
      .from('inventory_items')
      .insert([itemData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: item, error } = await supabase
      .from('inventory_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(item);
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const { item_id } = req.query;
    let query = supabase
      .from('inventory_transactions')
      .select(`
        *,
        item:item_id(name),
        performed_by_profile:performed_by(full_name)
      `)
      .order('transaction_date', { ascending: false });

    if (item_id) {
      query = query.eq('item_id', item_id);
    }

    const { data: transactions, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Get inventory transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      performed_by: (req as any).user.id
    };

    const { data: transaction, error } = await supabase
      .from('inventory_transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (transaction.transaction_type === 'in') {
      await supabase
        .from('inventory_items')
        .update({
          current_quantity: supabase.rpc('increment_quantity', {
            item_id: transaction.item_id,
            quantity: transaction.quantity
          })
        })
        .eq('id', transaction.item_id);
    } else if (transaction.transaction_type === 'out') {
      await supabase
        .from('inventory_items')
        .update({
          current_quantity: supabase.rpc('decrement_quantity', {
            item_id: transaction.item_id,
            quantity: transaction.quantity
          })
        })
        .eq('id', transaction.item_id);
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create inventory transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;