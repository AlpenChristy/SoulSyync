import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Horoscope, insertHoroscopeSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { format, subDays, addDays } from "date-fns";
import HoroscopeCreator from "./HoroscopeCreator";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";

const HoroscopeEditor = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingHoroscopeId, setEditingHoroscopeId] = useState<number | null>(null);
  const { toast } = useToast();

  // Format date for API calls
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Form schema extending the insert schema
  const formSchema = insertHoroscopeSchema.extend({
    id: z.number().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sign: "aries",
      content: "",
      date: formattedDate,
    },
  });

  // Fetch horoscopes for selected date
  const { data, isLoading, refetch } = useQuery<{ success: boolean; data: Horoscope[] }>({
    queryKey: ["/api/horoscopes", { date: formattedDate }],
  });

  const horoscopes = data?.data || [];

  // Create horoscope mutation
  const createHoroscope = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Creating horoscope with values:", values);
      const res = await apiRequest("POST", "/api/horoscopes", values);
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Horoscope creation response:", data);
      if (data.success) {
        toast({
          title: "Success",
          description: "Horoscope created successfully",
        });
        // Be more specific with the query keys to invalidate all related queries
        queryClient.invalidateQueries({ queryKey: ["/api/horoscopes"] });
        // Also invalidate the specific date query used by this component
        queryClient.invalidateQueries({ queryKey: ["/api/horoscopes", { date: formattedDate }] });
        // Reset the form
        form.reset({
          sign: "aries",
          content: "",
          date: formattedDate,
        });
        // Manually trigger a refetch to ensure the data is updated
        refetch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create horoscope",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Error creating horoscope:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Update horoscope mutation
  const updateHoroscope = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!editingHoroscopeId) return null;
      const res = await apiRequest("PUT", `/api/horoscopes/${editingHoroscopeId}`, values);
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: "Success",
          description: "Horoscope updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/horoscopes"] });
        form.reset({
          sign: "aries",
          content: "",
          date: formattedDate,
        });
        setEditingHoroscopeId(null);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to update horoscope",
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

  // Delete horoscope mutation
  const deleteHoroscope = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/horoscopes/${id}`, {});
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: "Horoscope deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/horoscopes"] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete horoscope",
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

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    console.log("Submitting horoscope with values:", values);
    
    const submissionData = {
      ...values,
      date: formattedDate,
    };

    console.log("Final submission data:", submissionData);

    if (editingHoroscopeId) {
      updateHoroscope.mutate(submissionData);
    } else {
      createHoroscope.mutate(submissionData);
    }
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue("date", format(date, "yyyy-MM-dd"));
      // Cancel any editing when changing dates
      setEditingHoroscopeId(null);
      form.reset({
        sign: "aries",
        content: "",
        date: format(date, "yyyy-MM-dd"),
      });
    }
  };

  // Edit horoscope
  const handleEditHoroscope = (horoscope: Horoscope) => {
    setEditingHoroscopeId(horoscope.id);
    form.reset({
      sign: horoscope.sign,
      content: horoscope.content,
      date: horoscope.date,
    });
  };

  // Delete horoscope with confirmation
  const handleDeleteHoroscope = (id: number) => {
    if (window.confirm("Are you sure you want to delete this horoscope? This action cannot be undone.")) {
      deleteHoroscope.mutate(id);
    }
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const previousDay = subDays(selectedDate, 1);
    handleDateChange(previousDay);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    handleDateChange(nextDay);
  };

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold mb-6">Horoscope Management</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Date selection */}
        <Card className="md:w-64">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>
              Choose a date to manage horoscopes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousDay}
                className="w-[48%]"
              >
                Previous Day
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextDay}
                className="w-[48%]"
              >
                Next Day
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Horoscope editor and list */}
        <div className="flex-1">
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create/Edit</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Create</TabsTrigger>
              <TabsTrigger value="list">View All ({horoscopes.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingHoroscopeId ? "Edit Horoscope" : "Create New Horoscope"}
                  </CardTitle>
                  <CardDescription>
                    {editingHoroscopeId 
                      ? "Update the horoscope for a specific sign" 
                      : "Add a new horoscope for a zodiac sign"}
                    {" "}on {format(selectedDate, "MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="sign"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zodiac Sign</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a sign" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ZODIAC_SIGNS.map((sign) => (
                                  <SelectItem 
                                    key={sign.name.toLowerCase()} 
                                    value={sign.name.toLowerCase()}
                                  >
                                    {sign.emoji} {sign.name}
                                    {horoscopes.some(h => 
                                      h.sign.toLowerCase() === sign.name.toLowerCase() && 
                                      h.id !== editingHoroscopeId
                                    ) ? ' (Already created)' : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              You can select any zodiac sign, but those already created will be marked
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horoscope Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write the horoscope prediction here..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-3">
                        {editingHoroscopeId && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setEditingHoroscopeId(null);
                              form.reset({
                                sign: "aries",
                                content: "",
                                date: formattedDate,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button 
                          type="submit" 
                          disabled={createHoroscope.isPending || updateHoroscope.isPending}
                        >
                          {(createHoroscope.isPending || updateHoroscope.isPending) 
                            ? "Saving..." 
                            : editingHoroscopeId ? "Update Horoscope" : "Save Horoscope"
                          }
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bulk">
              <HoroscopeCreator />
            </TabsContent>
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Horoscopes for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                  <CardDescription>
                    View and manage all horoscopes for this date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading horoscopes...</div>
                  ) : horoscopes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No horoscopes found for this date</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Use the Create tab to add horoscopes
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {horoscopes.map(horoscope => {
                        const zodiacSign = ZODIAC_SIGNS.find(
                          sign => sign.name.toLowerCase() === horoscope.sign.toLowerCase()
                        );
                        
                        return (
                          <div 
                            key={horoscope.id} 
                            className="border rounded-md p-4"
                          >
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{zodiacSign?.emoji}</span>
                                <h3 className="font-medium">
                                  {zodiacSign?.name} <span className="text-sm text-gray-500">({zodiacSign?.dates})</span>
                                </h3>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditHoroscope(horoscope)}
                                  className="flex items-center gap-1"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  <span>Edit</span>
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleDeleteHoroscope(horoscope.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </Button>
                              </div>
                            </div>
                            <p className="mt-3 text-gray-700 text-sm">
                              {horoscope.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HoroscopeEditor;
