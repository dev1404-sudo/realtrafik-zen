import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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
    const vehicleId = segments[segments.length - 1];

    switch (req.method) {
      case 'GET':
        if (vehicleId && vehicleId !== 'vehicles-api') {
          // GET /api/vehicles/:id
          const { data: vehicle, error } = await supabaseClient
            .from('vehicles')
            .select('*')
            .eq('id', vehicleId)
            .maybeSingle();

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          if (!vehicle) {
            return new Response(JSON.stringify({ error: 'Vehicle not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(vehicle), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // GET /api/vehicles
          const { data: vehicles, error } = await supabaseClient
            .from('vehicles')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(vehicles), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        // POST /api/vehicles
        const newVehicleData = await req.json();
        
        const { data: newVehicle, error: insertError } = await supabaseClient
          .from('vehicles')
          .insert([{
            vehicle_id: newVehicleData.vehicle_id,
            license_plate: newVehicleData.license_plate,
            type: newVehicleData.type,
            model: newVehicleData.model,
            year: newVehicleData.year,
            status: newVehicleData.status || 'active',
            speed_limit: newVehicleData.speed_limit || 60
          }])
          .select()
          .single();

        if (insertError) {
          return new Response(JSON.stringify({ error: insertError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(newVehicle), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        // PUT /api/vehicles/:id
        if (!vehicleId || vehicleId === 'vehicles-api') {
          return new Response(JSON.stringify({ error: 'Vehicle ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        
        const { data: updatedVehicle, error: updateError } = await supabaseClient
          .from('vehicles')
          .update(updateData)
          .eq('id', vehicleId)
          .select()
          .single();

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(updatedVehicle), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        // DELETE /api/vehicles/:id
        if (!vehicleId || vehicleId === 'vehicles-api') {
          return new Response(JSON.stringify({ error: 'Vehicle ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabaseClient
          .from('vehicles')
          .delete()
          .eq('id', vehicleId);

        if (deleteError) {
          return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ message: 'Vehicle deleted successfully' }), {
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