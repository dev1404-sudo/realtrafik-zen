import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Car, 
  Truck, 
  Bus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  MapPin
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockVehicles = [
  {
    id: 'KA-05-1234',
    type: 'bus',
    driver: 'Rajesh Kumar',
    status: 'active',
    location: 'MG Road',
    fuel: 75,
    violations: 0,
    lastUpdate: '2 min ago'
  },
  {
    id: 'KA-05-5678',
    type: 'truck',
    driver: 'Suresh Babu',
    status: 'violation',
    location: 'Electronic City',
    fuel: 45,
    violations: 2,
    lastUpdate: '1 min ago'
  },
  {
    id: 'KA-05-9012',
    type: 'car',
    driver: 'Priya Sharma',
    status: 'active',
    location: 'Koramangala',
    fuel: 90,
    violations: 0,
    lastUpdate: '5 min ago'
  },
  {
    id: 'KA-05-3456',
    type: 'bus',
    driver: 'Mohammad Ali',
    status: 'maintenance',
    location: 'Depot',
    fuel: 20,
    violations: 1,
    lastUpdate: '1 hour ago'
  },
  {
    id: 'KA-05-7890',
    type: 'truck',
    driver: 'Lakshmi Devi',
    status: 'active',
    location: 'Whitefield',
    fuel: 65,
    violations: 0,
    lastUpdate: '3 min ago'
  },
];

const VehicleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles] = useState(mockVehicles);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bus': return Bus;
      case 'truck': return Truck;
      case 'car': return Car;
      default: return Car;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-traffic-green text-white">Active</Badge>;
      case 'violation':
        return <Badge className="bg-traffic-red text-white">Violation</Badge>;
      case 'maintenance':
        return <Badge className="bg-traffic-yellow text-black">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fleet Management</h2>
          <p className="text-muted-foreground">Monitor and manage your vehicle fleet</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-traffic-green/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-traffic-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{vehicles.filter(v => v.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-traffic-red/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-traffic-red" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Violations</p>
                <p className="text-xl font-bold">{vehicles.filter(v => v.status === 'violation').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-traffic-yellow/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-traffic-yellow" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-xl font-bold">{vehicles.filter(v => v.status === 'maintenance').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fleet</p>
                <p className="text-xl font-bold">{vehicles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle ID, driver, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Table */}
      <Card className="bg-glass-bg border-glass-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Vehicle Fleet</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Fuel</TableHead>
                <TableHead>Violations</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => {
                const VehicleIcon = getVehicleIcon(vehicle.type);
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                          <VehicleIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{vehicle.id}</p>
                          <p className="text-xs text-muted-foreground capitalize">{vehicle.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{vehicle.driver}</p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vehicle.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{vehicle.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-sm ${
                          vehicle.fuel < 30 ? 'text-traffic-red' : 
                          vehicle.fuel < 50 ? 'text-traffic-yellow' : 'text-traffic-green'
                        }`}>
                          {vehicle.fuel}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {vehicle.violations > 0 && (
                          <AlertTriangle className="w-3 h-3 text-traffic-red" />
                        )}
                        <span className={vehicle.violations > 0 ? 'text-traffic-red' : 'text-muted-foreground'}>
                          {vehicle.violations}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{vehicle.lastUpdate}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleManagement;