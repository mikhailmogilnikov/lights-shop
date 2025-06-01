import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import type { ApiComponents } from '@/shared/api'
import { rqClient } from '@/shared/api'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

export function OrdersTable({ data }: { data: Array<ApiComponents['Order']> }) {
  const sortedOrders = useMemo(() => {
    return data.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [data])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Total items</TableHead>
          <TableHead className="pr-4">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="pl-4">
              {order.customerName} {order.customerLastName}
            </TableCell>
            <TableCell>{order.customerEmail}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              {order.totalAmount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </TableCell>
            <TableCell>
              {order.items.reduce((acc, item) => acc + item.quantity, 0)}
            </TableCell>
            <TableCell className="pr-4">
              <OrderStatus order={order} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

type OrderStatus = ApiComponents['OrderStatus']

const OrderStatus = ({ order }: { order: ApiComponents['Order'] }) => {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<OrderStatus>(order.status)

  const { mutate: updateOrderStatus } = rqClient.useMutation(
    'patch',
    '/admin/orders/{id}/status',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          rqClient.queryOptions('get', '/admin/orders'),
        )
      },
    },
  )

  const handleStatusChange = (orderStatus: OrderStatus) => {
    updateOrderStatus({
      params: { path: { id: order.id } },
      body: { status: orderStatus },
    })
    setStatus(orderStatus)
  }

  return (
    <Select
      value={status}
      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="SHIPPED">Shipped</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
        <SelectItem value="CANCELLED">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  )
}
