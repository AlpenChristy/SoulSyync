import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Service } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { generateTimeSlots, formatCurrency } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { format, addDays, addMonths, isBefore, isAfter, startOfDay } from "date-fns";

interface BookingFormProps {
  serviceId: number;
  service?: Service;
}

const BookingForm = ({ serviceId, service }: BookingFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Validation schema
  const formSchema = z.object({
    date: z.date({
      required_error: "Please select a date",
    }),
    time: z.string({
      required_error: "Please select a time",
    }),
    notes: z.string().optional(),
    sendReminder: z.boolean().default(true),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
      sendReminder: true,
    },
    mode: "onChange"
  });

  // Generate time slots
  const timeSlots = generateTimeSlots(9, 17);

  // Disable dates in the past and more than 3 months in the future
  const today = startOfDay(new Date());
  const threeMonthsFromNow = addMonths(today, 3);
  
  const disableDate = (date: Date) => {
    return isBefore(date, today) || isAfter(date, threeMonthsFromNow);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue("date", date);
    }
  };

  // Booking mutation
  const bookAppointment = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!isAuthenticated || !user) {
        throw new Error("You must be logged in to book an appointment");
      }
      
      // Make sure we have the correct serviceId
      if (!serviceId) {
        throw new Error("Please select a service");
      }
      
      const appointmentData = {
        serviceId,
        userId: user.id,
        date: format(values.date, "yyyy-MM-dd"),
        time: values.time,
        notes: values.notes || "",
        status: "pending",
        sendReminder: values.sendReminder
      };
      
      console.log("Booking appointment with data:", appointmentData);
      
      const res = await apiRequest("POST", "/api/appointments", appointmentData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to book appointment");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Booking Confirmed",
          description: "Your appointment has been scheduled successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
        form.reset();
        setSelectedDate(undefined);
      } else {
        toast({
          title: "Booking Failed",
          description: data.message || "There was an error booking your appointment.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "There was an error booking your appointment.",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      return;
    }
    
    bookAppointment.mutate(values);
  };

  return (
    <div className="mt-4">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-semibold text-slate-800">{service?.name}</h3>
        <div className="flex items-center mt-2">
          <span className="text-primary-600 font-semibold">{service ? formatCurrency(service.price) : ""}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-slate-600">{service?.duration} minutes</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Date</FormLabel>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={disableDate}
                  classNames={{
                    day_selected: "bg-primary-600 text-primary-foreground hover:bg-primary-600 hover:text-primary-foreground focus:bg-primary-600 focus:text-primary-foreground",
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests or Concerns</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Let us know any special requests or concerns you might have..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sendReminder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Email Reminder</FormLabel>
                  <FormDescription>
                    Receive a reminder 24 hours before your appointment
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {!isAuthenticated && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Authentication required</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You need to be logged in to book an appointment.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={bookAppointment.isPending || !isAuthenticated || !selectedDate || !form.watch("time")}
          >
            {bookAppointment.isPending ? "Processing..." : "Confirm Booking"}
          </Button>
          
          {!selectedDate && (
            <div className="text-sm text-amber-600">Please select a date to continue</div>
          )}
          
          {selectedDate && !form.watch("time") && (
            <div className="text-sm text-amber-600">Please select a time slot</div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
