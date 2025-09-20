import express from 'express';
import { supabase } from '../utils/supabase';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select(`
        *,
        assigned_doctor:assigned_doctor_id(full_name),
        assigned_nurse:assigned_nurse_id(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: patient, error } = await supabase
      .from('patients')
      .select(`
        *,
        assigned_doctor:assigned_doctor_id(full_name),
        assigned_nurse:assigned_nurse_id(full_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const patientData = req.body;

    const { data: patient, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(patient);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: patient, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(patient);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/monitoring', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: monitoring, error } = await supabase
      .from('patient_monitoring')
      .select(`
        *,
        recorded_by_profile:recorded_by(full_name)
      `)
      .eq('patient_id', id)
      .order('recorded_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(monitoring);
  } catch (error) {
    console.error('Get patient monitoring error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/monitoring', async (req, res) => {
  try {
    const { id } = req.params;
    const monitoringData = {
      ...req.body,
      patient_id: id,
      recorded_by: (req as any).user.id
    };

    const { data: monitoring, error } = await supabase
      .from('patient_monitoring')
      .insert([monitoringData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(monitoring);
  } catch (error) {
    console.error('Create monitoring record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;