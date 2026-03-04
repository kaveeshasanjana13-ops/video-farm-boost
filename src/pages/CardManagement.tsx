/**
 * CardManagement - Main page for ID Card management
 */

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Package, Wallet } from 'lucide-react';
import CardCatalog from '@/components/cards/CardCatalog';
import MyOrders from '@/components/cards/MyOrders';
import MyCards from '@/components/cards/MyCards';
import PageContainer from '@/components/layout/PageContainer';
import AppLayout from '@/components/layout/AppLayout';

const CardManagement: React.FC = () => {
  return (
    <AppLayout currentPage="id-cards">
      <PageContainer>
        <div className="space-y-10">
          {/* Page Header */}
          <div className="pt-4 pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">ID Card Management</h1>
            <p className="text-muted-foreground mt-2">Order and manage your ID cards</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="catalog" className="space-y-10">
            <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
              <TabsTrigger value="catalog" className="flex items-center gap-2 py-2.5">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 py-2.5">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="my-cards" className="flex items-center gap-2 py-2.5">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">My Cards</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="mt-8">
              <CardCatalog />
            </TabsContent>

            <TabsContent value="orders" className="mt-8">
              <MyOrders />
            </TabsContent>

            <TabsContent value="my-cards" className="mt-8">
              <MyCards />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </AppLayout>
  );
};

export default CardManagement;
