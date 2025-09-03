import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      'https://iujsllxadtqrbamjbfmr.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1anNsbHhhZHRxcmJhbWpiZm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTYzMjgsImV4cCI6MjA3MjQ5MjMyOH0.vAXavb04robBAkSAlKg0uOkzoUS3HSH9oCx90O7CZFA',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabaseClient.auth.setSession({ access_token: authHeader.replace('Bearer ', ''), refresh_token: '' });
    }

    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const violationId = segments[segments.length - 1];

    switch (req.method) {
      case 'GET':
        // GET /api/violations
        const { data: violations, error } = await supabaseClient
          .from('violations')
          .select(`
            *,
            vehicles (
              vehicle_id,
              license_plate,
              type
            ),
            drivers (
              driver_id,
              full_name
            )
          `)
          .order('detected_at', { ascending: false });

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(violations), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'POST':
        // POST /api/violations - Record violation
        const violationData = await req.json();
        
        const { data: newViolation, error: insertError } = await supabaseClient
          .from('violations')
          .insert([{
            vehicle_id: violationData.vehicle_id,
            driver_id: violationData.driver_id,
            violation_type: violationData.violation_type,
            description: violationData.description,
            location_lat: violationData.location_lat,
            location_lng: violationData.location_lng,
            location_name: violationData.location_name,
            speed_recorded: violationData.speed_recorded,
            speed_limit: violationData.speed_limit,
            fine_amount: violationData.fine_amount || 500.00,
            evidence_url: violationData.evidence_url,
            detected_by: violationData.detected_by || 'manual'
          }])
          .select(`
            *,
            vehicles (
              vehicle_id,
              license_plate,
              type
            ),
            drivers (
              driver_id,
              full_name
            )
          `)
          .single();

        if (insertError) {
          return new Response(JSON.stringify({ error: insertError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(newViolation), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        // PUT /api/violations/:id/pay - Mark fine as paid
        if (!violationId || violationId === 'violations-api') {
          return new Response(JSON.stringify({ error: 'Violation ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Check if the URL ends with /pay
        if (!url.pathname.endsWith('/pay')) {
          return new Response(JSON.stringify({ error: 'Invalid endpoint. Use /pay to mark fine as paid' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: paidViolation, error: payError } = await supabaseClient
          .from('violations')
          .update({ fine_status: 'paid' })
          .eq('id', violationId.replace('/pay', ''))
          .select()
          .single();

        if (payError) {
          return new Response(JSON.stringify({ error: payError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(paidViolation), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});