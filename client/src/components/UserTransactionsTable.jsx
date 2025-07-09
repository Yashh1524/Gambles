'use client';
import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: info => `₹${info.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor('type', {
        header: 'Type',
        cell: info => (
            <span className={`font-semibold ${info.getValue() === 'DEPOSIT' ? 'text-blue-400' : 'text-yellow-400'}`}>
                {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1).toLowerCase()}
            </span>
        ),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const value = info.getValue();
            const color =
                value === 'SUCCESS' ? 'text-green-500' :
                value === 'FAILED' ? 'text-red-500' :
                'text-yellow-400';
            return (
                <span className={`font-medium ${color}`}>
                    {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                </span>
            );
        },
    }),
    columnHelper.accessor('razorpayOrderId', {
        header: 'Order ID',
        cell: info => <span className="text-sm text-gray-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('razorpayPaymentId', {
        header: 'Payment ID',
        cell: info => <span className="text-sm text-gray-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: info => new Date(info.getValue()).toLocaleString(),
    }),
];

export default function UserTransactionsTable({ transactions = [] }) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: Array.isArray(transactions) ? transactions : [],
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="bg-[#0F212E] p-4 rounded-xl border border-gray-900 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="text-lg font-semibold text-white">Your Transactions</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">Show rows:</label>
                    <select
                        className="bg-[#111827] text-white border border-gray-600 rounded px-2 py-1"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[10, 50, 100, 1000].map(count => (
                            <option key={count} value={count}>{count}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="w-full overflow-x-auto rounded-xl">
                <table className="w-full text-sm text-left text-white">
                    <thead className="bg-[#1A2934] text-gray-400">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-3 whitespace-nowrap">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-[#1A2934]">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b border-gray-700 hover:bg-[#1A2C38] transition">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {table.getRowModel().rows.length === 0 && (
                    <div className="text-center text-gray-400 py-6">No transactions to display.</div>
                )}
            </div>

            <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-white text-sm md:text-md">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
