/**
 * MyOrders - View and manage my card orders with Card/Table view modes
 */

import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  CreditCard,
  Eye,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
  LayoutGrid,
  Table2,
  Calendar,
} from 'lucide-react';
import { 
  userCardApi, 
  UserIdCardOrder, 
  OrderStatus, 
  CardType as CardTypeEnum,
  PaginatedOrdersResponse 
} from '@/api/userCard.api';
import { 
  orderStatusColors, 
  orderStatusLabels, 
  cardStatusLabels,
  formatDate,
  formatDateTime,
  formatPrice 
} from '@/utils/cardHelpers';
import { toast } from '@/hooks/use-toast';
import SubmitPaymentDialog from './SubmitPaymentDialog';
import OrderDetailsDialog from './OrderDetailsDialog';

interface Column {
  id: 'orderId' | 'card' | 'orderDate' | 'status' | 'price' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'orderId', label: 'Order ID', minWidth: 100 },
  { id: 'card', label: 'Card', minWidth: 170 },
  { id: 'orderDate', label: 'Order Date', minWidth: 120 },
  { id: 'status', label: 'Status', minWidth: 150 },
  { id: 'price', label: 'Price', minWidth: 100, align: 'right' },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' },
];

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<UserIdCardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<UserIdCardOrder | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'card' | 'table'>(() => {
    return (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
  });

  // Listen for viewMode changes from Settings
  useEffect(() => {
    const handleStorageChange = () => {
      const mode = (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
      setViewMode(mode);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchOrders = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);

      const params: any = {};
      if (statusFilter !== 'all') params.orderStatus = statusFilter;

      const response = await userCardApi.getMyOrders(params, forceRefresh);
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const loadOrderDetails = async (orderId: number) => {
    try {
      return await userCardApi.getOrderDetails(orderId, true);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load order details',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleViewDetails = async (order: UserIdCardOrder) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
    setDetailsLoading(true);

    const detailed = await loadOrderDetails(order.id);
    if (detailed) setSelectedOrder(detailed);

    setDetailsLoading(false);
  };

  const handleSubmitPayment = async (order: UserIdCardOrder) => {
    setSelectedOrder(order);
    setPaymentDialogOpen(true);
    setPaymentLoading(true);

    const detailed = await loadOrderDetails(order.id);
    if (detailed) setSelectedOrder(detailed);

    setPaymentLoading(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return <Clock className="h-4 w-4" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return <XCircle className="h-4 w-4" />;
      case OrderStatus.DELIVERING:
      case OrderStatus.ON_THE_WAY:
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const renderCardView = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Package className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No Orders Yet</h3>
              <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
              {/* Order ID & Status */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-muted-foreground">#{order.id}</span>
                <Badge className={`${orderStatusColors[order.orderStatus]} flex items-center gap-1`}>
                  {getStatusIcon(order.orderStatus)}
                  {orderStatusLabels[order.orderStatus]}
                </Badge>
              </div>

              {/* Card Info */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{order.card?.cardName || 'Unknown Card'}</p>
                  <Badge variant="outline" className="text-xs mt-0.5">
                    {order.cardType}
                  </Badge>
                </div>
              </div>

              {/* Date & Price */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(order.orderDate)}
                </div>
                <span className="font-semibold">
                  {order.card ? formatPrice(order.card.price) : '-'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewDetails(order)}
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  Details
                </Button>
                {order.orderStatus === OrderStatus.PENDING_PAYMENT && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSubmitPayment(order)}
                  >
                    <Upload className="h-4 w-4 mr-1.5" />
                    Pay
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTableView = () => (
    <Paper sx={{ 
      width: '100%', 
      overflow: 'hidden',
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: 'var(--radius)',
    }}>
      {loading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Orders Yet</h3>
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="orders table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        backgroundColor: 'hsl(var(--muted))',
                        color: 'hsl(var(--foreground))',
                        fontWeight: 'bold',
                        borderBottom: '1px solid hsl(var(--border))',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow hover key={order.id} sx={{
                      '&:hover': {
                        backgroundColor: 'hsl(var(--muted) / 0.5)',
                      },
                    }}>
                      <TableCell sx={{ color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>
                        <span className="font-mono text-sm">#{order.id}</span>
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{order.card?.cardName || 'Unknown Card'}</p>
                            <Badge variant="outline" className="text-xs">{order.cardType}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>
                        {formatDate(order.orderDate)}
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>
                        <Badge className={`${orderStatusColors[order.orderStatus]} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(order.orderStatus)}
                          {orderStatusLabels[order.orderStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))', fontWeight: 600 }}>
                        {order.card ? formatPrice(order.card.price) : '-'}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.orderStatus === OrderStatus.PENDING_PAYMENT && (
                            <Button variant="default" size="sm" onClick={() => handleSubmitPayment(order)}>
                              <Upload className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: 'hsl(var(--foreground))',
              borderTop: '1px solid hsl(var(--border))',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: 'hsl(var(--muted-foreground))',
              },
              '& .MuiTablePagination-select': { color: 'hsl(var(--foreground))' },
              '& .MuiIconButton-root': { color: 'hsl(var(--foreground))' },
              '& .MuiIconButton-root.Mui-disabled': { color: 'hsl(var(--muted-foreground))' },
            }}
          />
        </>
      )}
    </Paper>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Orders</h2>
          <p className="text-muted-foreground">Track your ID card orders</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'card' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              title="Table View"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value={OrderStatus.PENDING_PAYMENT}>Pending Payment</SelectItem>
            <SelectItem value={OrderStatus.PAYMENT_RECEIVED}>Payment Received</SelectItem>
            <SelectItem value={OrderStatus.VERIFYING}>Verifying</SelectItem>
            <SelectItem value={OrderStatus.VERIFIED}>Verified</SelectItem>
            <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
            <SelectItem value={OrderStatus.PRINTING}>Printing</SelectItem>
            <SelectItem value={OrderStatus.DELIVERING}>Delivering</SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {viewMode === 'card' ? renderCardView() : renderTableView()}

      {/* Dialogs */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        loading={detailsLoading}
      />

      <SubmitPaymentDialog
        order={selectedOrder}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        loadingOrder={paymentLoading}
        onSuccess={() => {
          setPaymentDialogOpen(false);
          fetchOrders(true);
        }}
      />
    </div>
  );
};

export default MyOrders;
