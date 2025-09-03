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

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
    const endpoint = segments[segments.length - 1];

    switch (endpoint) {
      case 'vehicles':
        // GET /api/analytics/vehicles - Count active/inactive vehicles
        const { data: vehicleStats, error: vehicleError } = await supabaseClient
          .from('vehicles')
          .select('status');

        if (vehicleError) {
          return new Response(JSON.stringify({ error: vehicleError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const vehicleAnalytics = {
          total: vehicleStats.length,
          active: vehicleStats.filter(v => v.status === 'active').length,
          inactive: vehicleStats.filter(v => v.status === 'inactive').length,
          maintenance: vehicleStats.filter(v => v.status === 'maintenance').length,
          breakdown: vehicleStats.reduce((acc, vehicle) => {
            acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };

        return new Response(JSON.stringify(vehicleAnalytics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'violations':
        // GET /api/analytics/violations - Breakdown by type, fines collected
        const { data: violationStats, error: violationError } = await supabaseClient
          .from('violations')
          .select('violation_type, fine_amount, fine_status');

        if (violationError) {
          return new Response(JSON.stringify({ error: violationError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const violationAnalytics = {
          total: violationStats.length,
          byType: violationStats.reduce((acc, violation) => {
            acc[violation.violation_type] = (acc[violation.violation_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byStatus: violationStats.reduce((acc, violation) => {
            acc[violation.fine_status] = (acc[violation.fine_status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          totalFines: violationStats.reduce((sum, violation) => sum + (violation.fine_amount || 0), 0),
          collectedFines: violationStats
            .filter(v => v.fine_status === 'paid')
            .reduce((sum, violation) => sum + (violation.fine_amount || 0), 0),
          pendingFines: violationStats
            .filter(v => v.fine_status === 'pending')
            .reduce((sum, violation) => sum + (violation.fine_amount || 0), 0)
        };

        return new Response(JSON.stringify(violationAnalytics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'congestion':
        // GET /api/analytics/congestion - Clustered data for congestion map
        const { data: trackingData, error: trackingError } = await supabaseClient
          .from('vehicle_tracking')
          .select('latitude, longitude, speed, timestamp')
          .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
          .order('timestamp', { ascending: false });

        if (trackingError) {
          return new Response(JSON.stringify({ error: trackingError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Simple clustering algorithm - group by approximate location
        const clusters = new Map();
        const clusterRadius = 0.01; // Roughly 1km

        trackingData.forEach(point => {
          const clusterKey = `${Math.round(point.latitude / clusterRadius)}_${Math.round(point.longitude / clusterRadius)}`;
          
          if (!clusters.has(clusterKey)) {
            clusters.set(clusterKey, {
              center: { lat: point.latitude, lng: point.longitude },
              vehicles: [],
              averageSpeed: 0,
              density: 0
            });
          }
          
          const cluster = clusters.get(clusterKey);
          cluster.vehicles.push(point);
          cluster.density = cluster.vehicles.length;
          cluster.averageSpeed = cluster.vehicles.reduce((sum, v) => sum + v.speed, 0) / cluster.vehicles.length;
        });

        const congestionData = Array.from(clusters.values()).map(cluster => ({
          center: cluster.center,
          density: cluster.density,
          averageSpeed: cluster.averageSpeed,
          congestionLevel: cluster.averageSpeed < 20 ? 'high' : cluster.averageSpeed < 40 ? 'medium' : 'low'
        }));

        return new Response(JSON.stringify(congestionData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid analytics endpoint' }), {
          status: 404,
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