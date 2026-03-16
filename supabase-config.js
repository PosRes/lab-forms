// ── Supabase Configuration for Lab Forms ──
// Shared across all HTML pages

const SUPABASE_URL = 'https://beukcvuuigckggeoyxeq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldWtjdnV1aWdja2dnZW95eGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MTc2NDUsImV4cCI6MjA4OTE5MzY0NX0.NR7GqwX2HviVPxIbclzC9zS_sa5t9BdEgOibrm6wweA';

// ── Lazy-init Supabase client ──
let _sb = null;
function sb() {
  if (!_sb) {
    _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _sb;
}

// ── Table mapping (matches the old Google Sheets names) ──
const SHEET_TO_TABLE = {
  'MOR Records': 'mor_records',
  'RSR Records': 'rsr_records',
  'Equipment Log': 'equipment_logs',
  'Autoclave Log': 'equipment_logs',
  'Incubator Log': 'equipment_logs',
  'Refrigerator Log': 'equipment_logs',
  'BSC Log': 'equipment_logs',
  'Waterbath Log': 'equipment_logs',
  'Colony Counter Log': 'equipment_logs',
  'Balance Log': 'equipment_logs',
  'Microscope Log': 'equipment_logs',
};

// Map sheet names to equipment_type values
const SHEET_TO_EQUIP_TYPE = {
  'Autoclave Log': 'Autoclave',
  'Incubator Log': 'Incubator',
  'Refrigerator Log': 'Refrigerator',
  'BSC Log': 'Biosafety Cabinet',
  'Waterbath Log': 'Waterbath',
  'Colony Counter Log': 'Colony Counter',
  'Balance Log': 'Analytical Balance',
  'Microscope Log': 'Microscope',
};

// Map equipment types to sequence names for ID generation
const EQUIP_SEQ_MAP = {
  'Autoclave': 'eql_aut_seq',
  'Incubator': 'eql_inc_seq',
  'Refrigerator': 'eql_ref_seq',
  'Biosafety Cabinet': 'eql_bsc_seq',
  'Waterbath': 'eql_wtb_seq',
  'Colony Counter': 'eql_col_seq',
  'Analytical Balance': 'eql_bal_seq',
  'Microscope': 'eql_mic_seq',
};

const EQUIP_PREFIX_MAP = {
  'Autoclave': 'EQL-AUT',
  'Incubator': 'EQL-INC',
  'Refrigerator': 'EQL-REF',
  'Biosafety Cabinet': 'EQL-BSC',
  'Waterbath': 'EQL-WTB',
  'Colony Counter': 'EQL-COL',
  'Analytical Balance': 'EQL-BAL',
  'Microscope': 'EQL-MIC',
};

// ── Generate next Record ID via PostgreSQL sequence ──
async function supabaseNextId(prefix, seqName) {
  const { data, error } = await sb().rpc('next_record_id', {
    prefix: prefix,
    seq_name: seqName
  });
  if (error) throw error;
  return data;
}

// ── Fetch all records from a "sheet" (table) ──
async function supabaseFetchRecords(sheetName) {
  const table = SHEET_TO_TABLE[sheetName];
  if (!table) throw new Error('Unknown sheet: ' + sheetName);

  let query = sb().from(table).select('*').order('created_at', { ascending: false });

  // For equipment_logs, filter by equipment_type
  const equipType = SHEET_TO_EQUIP_TYPE[sheetName];
  if (equipType) {
    query = query.eq('equipment_type', equipType);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Flatten: merge the JSONB 'data' column into the top-level object
  return (data || []).map(row => {
    const { data: jsonData, id, ...rest } = row;
    return { ...rest, ...(jsonData || {}) };
  });
}

// ── Get record count for a "sheet" ──
async function supabaseCountRecords(sheetName) {
  const table = SHEET_TO_TABLE[sheetName];
  if (!table) return 0;

  let query = sb().from(table).select('id', { count: 'exact', head: true });

  const equipType = SHEET_TO_EQUIP_TYPE[sheetName];
  if (equipType) {
    query = query.eq('equipment_type', equipType);
  }

  const { count, error } = await query;
  if (error) return 0;
  return count || 0;
}

// ── Insert a record ──
async function supabaseInsertRecord(table, row) {
  const { data, error } = await sb().from(table).insert(row).select();
  if (error) throw error;
  return data?.[0];
}

// ── Update a record by record_id ──
async function supabaseUpdateRecord(table, recordId, updates) {
  const { data, error } = await sb().from(table).update(updates).eq('record_id', recordId).select();
  if (error) throw error;
  return data?.[0];
}

// ── Delete a record by record_id ──
async function supabaseDeleteRecord(table, recordId) {
  const { error } = await sb().from(table).delete().eq('record_id', recordId);
  if (error) throw error;
}
