import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const DetailsSection = () => {
    const {control} = useFormContext();
    return (
        <div className="space-y-2 text-[#607523]">
            <div>
                <h2 className="text-2xl font-bold">
                    Details
                </h2>
                <FormDescription>
                    Enter the details about your restaurant
                </FormDescription>
            </div>
            <FormField 
                control={control} 
                name="restaurantName" 
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}>
            </FormField>
            <div className="flex gap-4">
                <FormField 
                    control={control} 
                    name="area" 
                    render={({field}) => (
                        <FormItem className="flex-1">
                            <FormLabel>Area</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                </FormField>
                <FormField 
                    control={control} 
                    name="country" 
                    render={({field}) => (
                        <FormItem className="flex-1">
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                </FormField>
            </div>
            <FormField 
                    control={control} 
                    name="deliveryPrice" 
                    render={({field}) => (
                        <FormItem className="max-w-[25%]">
                            <FormLabel>Delivery Price (HKD)</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-white" placeholder="1.50"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
            </FormField>
            <FormField 
                    control={control} 
                    name="estimatedDeliveryTime" 
                    render={({field}) => (
                        <FormItem className="max-w-[25%]">
                            <FormLabel>Estimated Delivery Time (minutes)</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-white" placeholder="30"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
            </FormField>
        </div>
    )
};

export default DetailsSection;