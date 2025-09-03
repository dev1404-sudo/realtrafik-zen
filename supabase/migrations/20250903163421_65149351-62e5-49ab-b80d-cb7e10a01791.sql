-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'traffic_officer', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT NOT NULL UNIQUE,
  license_plate TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('bus', 'truck', 'car', 'motorcycle', 'emergency')),
  model TEXT,
  year INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  speed_limit INTEGER DEFAULT 60,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  assigned_vehicle_id UUID REFERENCES public.vehicles(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicle tracking table for real-time GPS data
CREATE TABLE public.vehicle_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2) NOT NULL DEFAULT 0,
  heading DECIMAL(5, 2),
  altitude DECIMAL(8, 2),
  accuracy DECIMAL(5, 2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create violations table
CREATE TABLE public.violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.drivers(id),
  violation_type TEXT NOT NULL CHECK (violation_type IN ('speeding', 'zone_entry', 'illegal_parking', 'traffic_signal', 'other')),
  description TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_name TEXT,
  speed_recorded DECIMAL(5, 2),
  speed_limit DECIMAL(5, 2),
  fine_amount DECIMAL(8, 2) NOT NULL DEFAULT 0,
  fine_status TEXT NOT NULL DEFAULT 'pending' CHECK (fine_status IN ('pending', 'paid', 'waived', 'disputed')),
  evidence_url TEXT,
  detected_by TEXT DEFAULT 'system',
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for vehicles (admin and traffic officers can manage)
CREATE POLICY "Admin and officers can manage vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'traffic_officer')
    )
  );

CREATE POLICY "Users can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

-- RLS Policies for drivers
CREATE POLICY "Admin and officers can manage drivers" ON public.drivers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'traffic_officer')
    )
  );

CREATE POLICY "Users can view drivers" ON public.drivers
  FOR SELECT USING (true);

-- RLS Policies for vehicle tracking
CREATE POLICY "Admin and officers can manage tracking" ON public.vehicle_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'traffic_officer')
    )
  );

CREATE POLICY "Users can view tracking data" ON public.vehicle_tracking
  FOR SELECT USING (true);

-- RLS Policies for violations
CREATE POLICY "Admin and officers can manage violations" ON public.violations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'traffic_officer')
    )
  );

CREATE POLICY "Users can view violations" ON public.violations
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_vehicles_license_plate ON public.vehicles(license_plate);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_drivers_license_number ON public.drivers(license_number);
CREATE INDEX idx_vehicle_tracking_vehicle_id ON public.vehicle_tracking(vehicle_id);
CREATE INDEX idx_vehicle_tracking_timestamp ON public.vehicle_tracking(timestamp DESC);
CREATE INDEX idx_violations_vehicle_id ON public.violations(vehicle_id);
CREATE INDEX idx_violations_type ON public.violations(violation_type);
CREATE INDEX idx_violations_status ON public.violations(fine_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_violations_updated_at
  BEFORE UPDATE ON public.violations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live tracking
ALTER TABLE public.vehicle_tracking REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_tracking;

-- Enable realtime for violations (for live alerts)
ALTER TABLE public.violations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.violations;