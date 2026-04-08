/**
 * OrderDetailsDialog - View full order details
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CreditCard,
  MapPin,
  Phone,
  FileText,
  Calendar,
  Clock,
  Truck,
  Hash,
  Wifi,
} from 'lucide-react';
import { UserIdCardOrder } from '@/api/userCard.api';
import {
  orderStatusColors,
  orderStatusLabels,
  cardStatusColors,
  cardStatusLabels,
  paymentStatusColors,
  paymentStatusLabels,
  formatDate,
  formatDateTime,
  formatPrice,
  getDaysUntilExpiry,
  isExpiringSoon,
} from '@/utils/cardHelpers';

interface OrderDetailsDialogProps {
  order: UserIdCardOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
  loading = false,
}) => {
  if (!order) return null;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Order #{order.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-28" />
            </div>

            <Separator />

            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(order.cardExpiryDate);
  const expiringSoon = isExpiringSoon(order.cardExpiryDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight">Order #{order.id}</p>
              <p className="text-xs text-muted-foreground font-normal">Order Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              <Badge className={orderStatusColors[order.orderStatus]}>
                Order: {orderStatusLabels[order.orderStatus]}
              </Badge>
              <Badge className={cardStatusColors[order.status]}>
                Card: {cardStatusLabels[order.status]}
              </Badge>
              {order.payment && (
                <Badge className={paymentStatusColors[order.payment.paymentStatus]}>
                  Payment: {paymentStatusLabels[order.payment.paymentStatus]}
                </Badge>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Card Details</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Card Name</span>
                <span className="text-xs font-medium">{order.card?.cardName || 'Unknown'}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Card Type</span>
                <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0">{order.cardType}</Badge>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Price</span>
                <span className="text-sm font-bold text-primary">{order.card ? formatPrice(order.card.price) : '—'}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Validity</span>
                <span className="text-xs font-medium">{order.card ? `${Math.floor(order.card.validityDays / 365)} year(s)` : '—'}</span>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Order Information</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />Order Date</span>
                <span className="text-xs font-medium">{formatDateTime(order.orderDate)}</span>
              </div>
              <div className={`flex flex-col gap-0.5 p-2.5 rounded-xl border ${expiringSoon ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800' : 'bg-muted/60 border-border/50'}`}>
                <span className={`text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1 ${expiringSoon ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}><Clock className="h-2.5 w-2.5" />Card Expiry</span>
                <span className={`text-xs font-medium ${expiringSoon ? 'text-orange-700 dark:text-orange-300' : ''}`}>
                  {formatDate(order.cardExpiryDate)}
                  {daysUntilExpiry > 0 && <span className="text-muted-foreground"> ({daysUntilExpiry}d)</span>}
                </span>
              </div>
              <div className="col-span-2 flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />Delivery Address</span>
                <span className="text-xs font-medium">{order.deliveryAddress}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Phone className="h-2.5 w-2.5" />Contact</span>
                <span className="text-xs font-medium">{order.contactPhone}</span>
              </div>
              {order.notes && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><FileText className="h-2.5 w-2.5" />Notes</span>
                  <span className="text-xs font-medium">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tracking & RFID */}
          {(order.trackingNumber || order.rfidNumber) && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Tracking &amp; Card ID</p>
              <div className="grid grid-cols-2 gap-2">
                {order.trackingNumber && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Truck className="h-2.5 w-2.5" />Tracking</span>
                    <span className="text-xs font-mono font-medium">{order.trackingNumber}</span>
                  </div>
                )}
                {order.rfidNumber && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Wifi className="h-2.5 w-2.5" />RFID</span>
                    <span className="text-xs font-mono font-medium">{order.rfidNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Details */}
          {order.payment && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Payment Details</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</span>
                  <span className="text-xs font-medium">{order.payment.paymentType.replace('_', ' ')}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Amount</span>
                  <span className="text-sm font-bold text-primary">{formatPrice(order.payment.paymentAmount)}</span>
                </div>
                {order.payment.paymentReference && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Reference</span>
                    <span className="text-xs font-mono font-medium">{order.payment.paymentReference}</span>
                  </div>
                )}
                {order.payment.verifiedAt && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">Verified At</span>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">{formatDateTime(order.payment.verifiedAt)}</span>
                  </div>
                )}
              </div>
              {order.payment.rejectionReason && (
                <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-1">Rejection Reason</p>
                  <p className="text-xs text-red-700 dark:text-red-300">{order.payment.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          {/* Alerts */}
          {order.rejectedReason && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-1">Order Rejected</p>
              <p className="text-xs text-red-700 dark:text-red-300">{order.rejectedReason}</p>
            </div>
          )}
          {order.deliveredAt && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 mb-1">Delivered</p>
              <p className="text-xs font-medium text-green-700 dark:text-green-300">{formatDateTime(order.deliveredAt)}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
