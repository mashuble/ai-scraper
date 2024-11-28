'use client';

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CoinsIcon, CreditCard } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditsPacks, PackId } from '@/types/billing';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { PurchaseCredits } from '@/actions/billing/PurchaseCredits';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

function CreditsPurchase() {
    const [selectedPack, setSelectedPack] = useState<PackId>(PackId.SMALL);

    const mutate = useMutation({
        mutationFn: PurchaseCredits,
        onSuccess: () => {
            toast.success('Credits purchased successfully');
        },
        onError: () => {
            toast.error('Failed to purchase credits');
        }
    })

    return (
        <Card>
            <CardHeader >
                <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                    <CoinsIcon size={24} className='h-6 w-6 text-primary' />
                    Purchase Credits
                </CardTitle>
                <CardDescription>
                    Select the number of credits you want to purchase.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup onValueChange={(value) => setSelectedPack(value as PackId)}>
                    {CreditsPacks.map((pack) => (
                        <div 
                            key={pack.id}
                            className='flex items-center space-x-3 bg-secondary/50 p-3 rounded-lg hover:bg-secondary'
                            onClick={() => setSelectedPack(pack.id)}
                        >

                            <RadioGroupItem value={pack.id} id={pack.id} />
                            <Label className='flex justify-between w-full cursor-pointer'>
                                <span className='font-medium'>
                                    {pack.name} - {pack.label}
                                </span>
                                <span className='font-bold text-primary'>
                                    ${(pack.price / 100).toFixed(2)}
                                </span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>

            <CardFooter>
                <Button
                    className='w-full'
                    disabled={mutate.isPending}
                    onClick={() => mutate.mutate(selectedPack)}
                >
                    <CreditCard className='w-5 h-5 mr-2' />
                    Purchase credits
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CreditsPurchase