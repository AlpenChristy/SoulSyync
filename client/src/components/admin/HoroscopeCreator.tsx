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
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon, CalendarIcon } from "lucide-react";

const formSchema = insertHoroscopeSchema.pick({
  content: true,
  date: true,
}).extend({
  selectedSigns: z.array(z.string()).min(1, {
    message: "Select at least one zodiac sign",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const HoroscopeCreator = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  // Format date for API calls
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      date: formattedDate,
      selectedSigns: [],
    },
  });

  // Fetch existing horoscopes for the selected date
  const { data, isLoading } = useQuery<{ success: boolean; data: Horoscope[] }>({
    queryKey: ["/api/horoscopes", { date: formattedDate }],
  });

  const existingHoroscopes = data?.data || [];
  const existingSigns = existingHoroscopes.map(h => h.sign.toLowerCase());

  // Create multiple horoscopes mutation
  const createHoroscopes = useMutation({
    mutationFn: async (values: FormValues) => {
      const results = await Promise.all(
        values.selectedSigns.map(async (sign) => {
          const horoscopeData = {
            sign,
            content: values.content,
            date: values.date,
          };
          
          const res = await apiRequest("POST", "/api/horoscopes", horoscopeData);
          return res.json();
        })
      );
      
      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter(result => result.success).length;
      const failed = results.length - successful;
      
      if (successful > 0) {
        toast({
          title: "Success",
          description: `Created ${successful} horoscopes successfully${failed > 0 ? ` (${failed} failed)` : ''}`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/horoscopes"] });
        form.reset({
          content: "",
          date: formattedDate,
          selectedSigns: [],
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create horoscopes",
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
    createHoroscopes.mutate({
      ...values,
      date: formattedDate,
    });
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue("date", format(date, "yyyy-MM-dd"));
    }
  };

  // Toggle select all signs
  const toggleSelectAll = () => {
    const availableSigns = ZODIAC_SIGNS
      .map(sign => sign.name.toLowerCase())
      .filter(sign => !existingSigns.includes(sign));
    
    const currentSelected = form.getValues("selectedSigns");
    
    if (currentSelected.length === availableSigns.length) {
      form.setValue("selectedSigns", []);
    } else {
      form.setValue("selectedSigns", availableSigns);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Create Horoscopes</CardTitle>
        <CardDescription>
          Create horoscopes for multiple zodiac signs with the same content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center">
              <FormLabel className="text-sm font-medium">Date:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal"
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
            </div>

            <FormField
              control={form.control}
              name="selectedSigns"
              render={() => (
                <FormItem>
                  <FormLabel>Select Zodiac Signs</FormLabel>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="select-all"
                      checked={form.getValues("selectedSigns").length === 
                        ZODIAC_SIGNS.filter(sign => !existingSigns.includes(sign.name.toLowerCase())).length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Select All Available
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {ZODIAC_SIGNS.map((zodiacSign) => {
                      const signName = zodiacSign.name.toLowerCase();
                      const isDisabled = existingSigns.includes(signName);
                      
                      return (
                        <FormField
                          key={signName}
                          control={form.control}
                          name="selectedSigns"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={signName}
                                className={`flex flex-row items-start space-x-2 space-y-0 rounded-md border p-3 
                                  ${isDisabled ? 'opacity-50 bg-gray-50' : ''}`}
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(signName)}
                                    disabled={isDisabled}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, signName])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== signName
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="flex gap-1.5 leading-none">
                                  <span>{zodiacSign.emoji}</span>
                                  <div className="space-y-1">
                                    <label
                                      htmlFor={signName}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {zodiacSign.name}
                                    </label>
                                    {isDisabled && (
                                      <p className="text-xs text-muted-foreground">
                                        Already exists
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      );
                    })}
                  </div>
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
                      placeholder="Write the horoscope prediction here. This will be used for all selected signs."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This content will be used for all selected zodiac signs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createHoroscopes.isPending}
            >
              {createHoroscopes.isPending ? (
                "Creating horoscopes..."
              ) : (
                "Create Horoscopes for Selected Signs"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HoroscopeCreator;