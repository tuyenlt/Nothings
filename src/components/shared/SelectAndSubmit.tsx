import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Loader from "./Loader"

interface Probs {
    selectValues: string[],
    onSubmit: (value: string) => Promise<void>,
    buttonText: string
}

export default function SelectAndSubmit({ selectValues, onSubmit, buttonText }: Probs) {
    if (selectValues == undefined || onSubmit == undefined) return
    const [loading, setLoading] = useState<boolean>(false);
    const form = useForm();

    const onSubmitHandle = async (data: any) => {
        setLoading(true);
        try {
            await onSubmit(data.values);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandle)} className="w-2/3 space-y-6 flex items-center">
                <FormField
                    control={form.control}
                    name="values"
                    render={({ field }) => (
                        <FormItem className="w-2/3">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={selectValues[0]} placeholder={selectValues[0]} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="">
                                    {
                                        selectValues.map((selectValue) => (
                                            <SelectItem value={selectValue}>{selectValue}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="ml-4 disable-btn-margin"
                    variant="outline"
                    disabled={loading} // disable button when loading
                >
                    {loading ? <Loader /> : buttonText} {/* Change text when loading */}
                </Button>
            </form>
        </Form>
    )
}
