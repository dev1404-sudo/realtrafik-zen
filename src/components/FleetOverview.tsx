import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, 
  AlertTriangle, 
  Fuel, 
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data
const violationData = [
  { time: '00:00', violations: 2 },
  { time: '04:00', violations: 1 },
  { time: '08:00', violations: 8 },
  { time: '12:00', violations: 12 },
  { time: '16:00', violations: 15 },
  { time: '20:00', violations: 6 },
];

const fuelData = [
  { day: 'Mon', consumed: 450 },
  { day: 'Tue', consumed: 520 },
  { day: 'Wed', consumed: 480 },
  { day: 'Thu', consumed: 600 },
  { day: 'Fri', consumed: 550 },
  { day: 'Sat', consumed: 300 },
  { day: 'Sun', consumed: 250 },
];

const vehicleTypeData = [
  { name: 'Buses', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Trucks', value: 30, color: 'hsl(var(--accent))' },
  { name: 'Cars', value: 25, color: 'hsl(var(--warning))' },
];

const FleetOverview = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-traffic-green flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +5 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Violations</p>
                <p className="text-2xl font-bold text-traffic-red">23</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  Last 24h
                </p>
              </div>
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                <p className="text-2xl font-bold">8.5L</p>
                <p className="text-xs text-traffic-green flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  /100km avg
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Fuel className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">₹45,200</p>
                <p className="text-xs text-traffic-green flex items-center gap-1 mt-1">
                  <DollarSign className="w-3 h-3" />
                  Today's fines
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Violations Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={violationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Line 
                  type="monotone" 
                  dataKey="violations" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-accent" />
              Weekly Fuel Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="consumed" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Fleet Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '09:45', event: 'Speed violation detected', vehicle: 'KA-05-5678', severity: 'high' },
                { time: '09:32', event: 'Vehicle entered restricted zone', vehicle: 'KA-05-1234', severity: 'medium' },
                { time: '09:18', event: 'Route deviation detected', vehicle: 'KA-05-9012', severity: 'low' },
                { time: '09:05', event: 'Fuel level critical', vehicle: 'KA-05-3456', severity: 'medium' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.severity === 'high' ? 'bg-traffic-red' :
                    activity.severity === 'medium' ? 'bg-traffic-yellow' : 'bg-traffic-green'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">Vehicle: {activity.vehicle}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FleetOverview;