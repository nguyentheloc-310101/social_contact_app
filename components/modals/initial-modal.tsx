'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.',
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required.',
  }),
});
const FormCreatePlanSchema = z.object({
  place: z.string(),
  duration: z.string(),
});
export const InitialModal = () => {
  const pathname = usePathname();
  console.log(pathname);
  const [isMounted, setIsMounted] = useState(false);
  const [requestPlan, setRequestPlan] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });
  const formCreatePlan = useForm<z.infer<typeof FormCreatePlanSchema>>({
    resolver: zodResolver(FormCreatePlanSchema),
  });
  function onSubmitCreatePlan(data: z.infer<typeof FormCreatePlanSchema>) {
    console.log(JSON.stringify(data, null, 2));
    try {
      formCreatePlan.reset();
      setRequestPlan(false);
      router.push('/invite/47090350-d122-4060-bd79-391ea7b284ae');
    } catch (error) {
      console.log(error);
    }
  }
  const isLoading = form.formState.isSubmitting;
  const isLoadingCreate = formCreatePlan.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      await axios.post('/api/servers', values);
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Dialog open={requestPlan}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Where you want to go?</DialogTitle>
            <DialogDescription>
              Let us know where you want to go, AI will give you a suitable plan
            </DialogDescription>
          </DialogHeader>
          <Form {...formCreatePlan}>
            <form
              onSubmit={formCreatePlan.handleSubmit(onSubmitCreatePlan)}
              className=" space-y-6">
              <FormField
                control={formCreatePlan.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Enter Place
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoadingCreate}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter place"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formCreatePlan.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Duration of time{' '}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Select duration of time you want to go">
                          <SelectValue placeholder="Select duration of time you want to go" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1 days 1 night">
                          1 days 1 night
                        </SelectItem>
                        <SelectItem value=" 2 days 1 night">
                          2 days 1 night
                        </SelectItem>
                        <SelectItem value="2 days 2 nights">
                          2 days 2 nights
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-[12px]">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setRequestPlan(false)}
                  disabled={isLoadingCreate}>
                  Cancel
                </Button>
                <Button
                  disabled={isLoadingCreate}
                  variant={'primary'}
                  type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Customize your Chat
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your Chat a personality with a name and an image. You can
              always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Chat server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter chat server name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setRequestPlan(true)}
                  disabled={isLoading}>
                  Request a plan and chat to meGoZ Admin
                </Button>

                <Button
                  variant="primary"
                  disabled={isLoading}>
                  Create Server
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
