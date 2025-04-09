import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Appointment, Service } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { format, parseISO } from "date-fns";
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_COLORS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ClipboardEdit,
  FileText,
  Clock,
  User,
  CalendarDays,
} from "lucide-react";

const AppointmentsList = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<string>("");

  // Fetch appointments
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useQuery<{ success: boolean; data: Appointment[] }>({
    queryKey: ["/api/appointments"],
  });

  // Fetch services for reference
  const { data: servicesData } = useQuery<{ success: boolean; data: Service[] }>({
    queryKey: ["/api/services"],
  });

  const appointments = appointmentsData?.data || [];
  const services = servicesData?.data || [];

  // Filter appointments based on status
  const filteredAppointments = filter === "all" 
    ? appointments 
    : appointments.filter(appointment => appointment.status === filter);

  // Get service name by ID
  const getServiceName = (serviceId: number): string => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };

  // Update appointment mutation
  const updateAppointment = useMutation({
    mutationFn: async (data: { id: number; status: string; summary?: string }) => {
      const res = await apiRequest("PUT", `/api/appointments/${data.id}`, {
        status: data.status,
        ...(data.summary && { summary: data.summary }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: "Appointment updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
        setIsUpdateDialogOpen(false);
        setIsSummaryDialogOpen(false);
        setSelectedAppointment(null);
        setSummary("");
        setStatus("");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update appointment",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete appointment mutation
  const deleteAppointment = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/appointments/${id}`, {});
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: "Appointment cancelled successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to cancel appointment",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Open update status dialog
  const handleUpdateStatus = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setStatus(appointment.status);
    setIsUpdateDialogOpen(true);
  };

  // Open add summary dialog
  const handleAddSummary = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSummary(appointment.summary || "");
    setIsSummaryDialogOpen(true);
  };

  // Cancel appointment with confirmation
  const handleCancelAppointment = (appointmentId: number) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      deleteAppointment.mutate(appointmentId);
    }
  };

  // Submit status update
  const handleStatusSubmit = () => {
    if (!selectedAppointment || !status) return;
    
    updateAppointment.mutate({
      id: selectedAppointment.id,
      status,
    });
  };

  // Submit summary
  const handleSummarySubmit = () => {
    if (!selectedAppointment) return;
    
    updateAppointment.mutate({
      id: selectedAppointment.id,
      status: selectedAppointment.status,
      summary,
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string): string => {
    return APPOINTMENT_STATUS_COLORS[status as keyof typeof APPOINTMENT_STATUS_COLORS] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold">Appointments</h2>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value={APPOINTMENT_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={APPOINTMENT_STATUS.CONFIRMED}>Confirmed</SelectItem>
              <SelectItem value={APPOINTMENT_STATUS.COMPLETED}>Completed</SelectItem>
              <SelectItem value={APPOINTMENT_STATUS.CANCELED}>Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "all" ? "All Appointments" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Manage all client appointments" 
              : "View and manage your scheduled appointments"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAppointments ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No appointments found</p>
              {filter !== "all" && (
                <Button 
                  variant="link" 
                  onClick={() => setFilter("all")}
                  className="mt-2"
                >
                  View all appointments
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    {isAdmin && <TableHead>Client</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {getServiceName(appointment.serviceId)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 text-sm">
                            <Clock className="h-3 w-3" />
                            {appointment.time}
                          </span>
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            Client #{appointment.userId}
                          </span>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge className={getStatusBadgeClass(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {appointment.notes 
                          ? appointment.notes.substring(0, 30) + (appointment.notes.length > 30 ? "..." : "")
                          : <span className="text-gray-400 text-sm italic">No notes</span>
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {appointment.status !== APPOINTMENT_STATUS.CANCELED && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(appointment)}
                              >
                                Update Status
                              </Button>
                              {(isAdmin && appointment.status === APPOINTMENT_STATUS.COMPLETED) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddSummary(appointment)}
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  {appointment.summary ? "Edit Summary" : "Add Summary"}
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === APPOINTMENT_STATUS.COMPLETED && appointment.summary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setSummary(appointment.summary || "");
                                setIsSummaryDialogOpen(true);
                              }}
                            >
                              View Summary
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Change the status for this appointment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Current Status:</p>
              <Badge className={getStatusBadgeClass(selectedAppointment?.status || "")}>
                {selectedAppointment?.status.charAt(0).toUpperCase() + selectedAppointment?.status.slice(1) || ""}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                New Status:
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={APPOINTMENT_STATUS.PENDING}>Pending</SelectItem>
                  <SelectItem value={APPOINTMENT_STATUS.CONFIRMED}>Confirmed</SelectItem>
                  <SelectItem value={APPOINTMENT_STATUS.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={APPOINTMENT_STATUS.CANCELED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusSubmit} disabled={!status || status === selectedAppointment?.status}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment?.summary ? "Session Summary" : "Add Session Summary"}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment?.summary
                ? `Review the summary for the ${getServiceName(selectedAppointment?.serviceId || 0)} session`
                : "Provide a summary of the completed session."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Service:</p>
                <p>{getServiceName(selectedAppointment?.serviceId || 0)}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Date & Time:</p>
                <p>{selectedAppointment?.date} at {selectedAppointment?.time}</p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="mb-4">
                <label htmlFor="summary" className="text-sm font-medium block mb-1">
                  Session Summary:
                </label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Enter detailed notes about the session, insights, recommendations, etc."
                  className="min-h-[200px]"
                />
              </div>
            )}
            
            {!isAdmin && selectedAppointment?.summary && (
              <div className="mb-4 border rounded-md p-4 bg-gray-50">
                <p className="text-sm font-medium mb-2">Session Summary:</p>
                <div className="whitespace-pre-wrap">
                  {selectedAppointment.summary}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSummaryDialogOpen(false)}>
              Close
            </Button>
            {isAdmin && (
              <Button 
                onClick={handleSummarySubmit} 
                disabled={summary === selectedAppointment?.summary}
              >
                Save Summary
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsList;
