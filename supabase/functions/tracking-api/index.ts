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

    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const vehicleId = segments[segments.length - 1];

    switch (req.method) {
      case 'POST':
        // POST /api/tracking - Push new location data
        const locationData = await req.json();
        
        // Check for speed violations
        let violation = null;
        if (locationData.speed > (locationData.speed_limit || 60)) {
          // Create a violation record
          const violationData = {
            vehicle_id: locationData.vehicle_id,
            violation_type: 'speeding',
            description: `Vehicle exceeded speed limit: ${locationData.speed} km/h in ${locationData.speed_limit || 60} km/h zone`,
            location_lat: locationData.latitude,
            location_lng: locationData.longitude,
            speed_recorded: locationData.speed,
            speed_limit: locationData.speed_limit || 60,
            fine_amount: 500.00, // Default fine amount
            detected_by: 'system'
          };

          const { data: newViolation, error: violationError } = await supabaseClient
            .from('violations')
            .insert([violationData])
            .select()
            .single();

          if (!violationError) {
            violation = newViolation;
          }
        }

        // Insert tracking data
        const { data: tracking, error: trackingError } = await supabaseClient
          .from('vehicle_tracking')
          .insert([{
            vehicle_id: locationData.vehicle_id,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            speed: locationData.speed,
            heading: locationData.heading,
            altitude: locationData.altitude,
            accuracy: locationData.accuracy,
            timestamp: locationData.timestamp || new Date().toISOString()
          }])
          .select()
          .single();

        if (trackingError) {
          return new Response(JSON.stringify({ error: trackingError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const response = {
          tracking,
          violation: violation || null,
          message: violation ? 'Location updated with speed violation detected' : 'Location updated successfully'
        };

        return new Response(JSON.stringify(response), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'GET':
        // GET /api/tracking/:vehicleId - Get latest location
        if (!vehicleId || vehicleId === 'tracking-api') {
          return new Response(JSON.stringify({ error: 'Vehicle ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: latestTracking, error: getError } = await supabaseClient
          .from('vehicle_tracking')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (getError) {
          return new Response(JSON.stringify({ error: getError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (!latestTracking) {
          return new Response(JSON.stringify({ error: 'No tracking data found for this vehicle' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(latestTracking), {
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