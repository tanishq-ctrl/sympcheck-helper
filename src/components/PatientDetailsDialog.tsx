import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  symptoms: z.string().min(10, "Please describe your symptoms in more detail"),
  age: z.string()
    .refine((val) => !val || !isNaN(parseInt(val)), "Age must be a number")
    .transform((val) => (val ? parseInt(val) : null))
    .nullable(),
  height: z.string()
    .refine((val) => !val || !isNaN(parseFloat(val)), "Height must be a number")
    .transform((val) => (val ? parseFloat(val) : null))
    .nullable(),
  weight: z.string()
    .refine((val) => !val || !isNaN(parseFloat(val)), "Weight must be a number")
    .transform((val) => (val ? parseFloat(val) : null))
    .nullable(),
});

interface PatientDetailsDialogProps {
  onSubmitted: (data: z.infer<typeof formSchema>) => void;
}

export function PatientDetailsDialog({ onSubmitted }: PatientDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      symptoms: "",
      age: "",
      height: "",
      weight: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("patient_details").insert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          full_name: values.fullName,
          phone_number: values.phoneNumber,
          email: values.email,
          initial_symptoms: values.symptoms,
          age: values.age,
          height: values.height,
          weight: values.weight,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Details saved successfully!",
        description: "Thank you for providing your information.",
      });
      onSubmitted(values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your details. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                What's your name? <span className="text-xl">🌟</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Age <span className="text-xl">👤</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Height <span className="text-xl">📏</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="cm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Weight <span className="text-xl">⚖️</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Can I have your phone number? <span className="text-xl">📱</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Your email address, please? <span className="text-xl">✉️</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Could you describe your symptoms? <span className="text-xl">🤒</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="E.g., fever, cough, headache, etc."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Saving...</span>
              <span className="animate-spin">⌛</span>
            </>
          ) : (
            "Start Consultation"
          )}
        </Button>
      </form>
    </Form>
  );
}